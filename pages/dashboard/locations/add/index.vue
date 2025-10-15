<script setup lang="ts">
//1.modules import
import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { AlertCircle, ArrowLeft } from 'lucide-vue-next'

//2.modules init
definePageMeta({
    layout: 'dashboard'
})

const router = useRouter()
const submitError = ref('')
const loading = ref(false)
</script>

<template>
    <section>
        <div class="mt-4 px-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-lg font-bold">Add Location</h1>
                    <p class="text-sm text-muted-foreground">
                        Add a new location here
                    </p>
                </div>
                <div>
                    <Button
                        :disabled="loading"
                        type="button"
                        variant="outline"
                        @click="router.back()"
                    >
                        <ArrowLeft class="w-4 h-4" /> Back
                    </Button>
                </div>
            </div>

            <div class="max-w-xl mx-auto">
                <Alert v-if="submitError" variant="destructive" class="mb-4">
                    <AlertCircle class="w-4 h-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {{ submitError }}
                    </AlertDescription>
                </Alert>
                <form class="space-y-6">
                    <fieldset :disabled="loading" class="space-y-6">
                        <FormField
                            v-slot="{ componentField }"
                            name="name"
                            :validate-on-blur="!isFieldDirty"
                            :disabled="loading"
                        >
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Your Location Name"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField
                            v-slot="{ componentField }"
                            name="description"
                            :validate-on-blur="!isFieldDirty"
                        >
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Type your description here."
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField
                            v-slot="{ componentField }"
                            name="lat"
                            :validate-on-blur="!isFieldDirty"
                        >
                            <FormItem>
                                <FormLabel>Latitude</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Latitude"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField
                            v-slot="{ componentField }"
                            name="long"
                            :validate-on-blur="!isFieldDirty"
                        >
                            <FormItem>
                                <FormLabel>Longitude</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Longitude"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <div class="flex justify-between">
                            <Button
                                :disabled="loading"
                                type="button"
                                variant="outline"
                                @click="router.back()"
                            >
                                Cancel
                            </Button>
                            <Button :disabled="loading" type="submit">
                                Submit
                                <LucideLoader2
                                    v-if="loading"
                                    class="animate-spin"
                                />
                                <LucideCirclePlus v-else />
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    </section>
</template>
