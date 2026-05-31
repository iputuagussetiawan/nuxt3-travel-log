<template>
    <div class="flex min-h-screen">
        <!-- Left: form panel -->
        <div
            class="relative flex w-full flex-col justify-center px-8 py-12 sm:px-12 lg:w-[480px] lg:px-16 xl:px-20"
        >
            <!-- Logo -->
            <NuxtLink to="/" class="mb-10 flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    class="h-6 w-6 text-emerald-500"
                >
                    <rect width="256" height="256" fill="none" />
                    <line
                        x1="208"
                        y1="128"
                        x2="128"
                        y2="208"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="32"
                    />
                    <line
                        x1="192"
                        y1="40"
                        x2="40"
                        y2="192"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="32"
                    />
                </svg>
                <span class="text-lg font-bold">Travel Log</span>
            </NuxtLink>

            <!-- Form content -->
            <div class="w-full max-w-sm">
                <slot />
            </div>
        </div>

        <!-- Right: hero image panel (hidden on mobile) -->
        <div class="relative hidden flex-1 lg:block">
            <!-- Background image -->
            <img
                src="/images/bg-signup.png"
                alt="Travel"
                class="absolute inset-0 h-full w-full object-cover"
            />
            <!-- Gradient overlay -->
            <div
                class="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-emerald-900/40"
            />

            <!-- Floating content -->
            <div
                class="absolute inset-0 flex flex-col items-start justify-end p-16"
            >
                <div class="max-w-md">
                    <div
                        class="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm"
                    >
                        <span
                            class="h-2 w-2 rounded-full bg-emerald-400"
                        ></span>
                        <span class="text-xs font-medium text-white/80"
                            >Your personal travel journal</span
                        >
                    </div>
                    <h2
                        class="mb-3 text-4xl leading-tight font-bold text-white"
                    >
                        Discover The World,<br />
                        <span class="text-emerald-400">One Journey</span> At a
                        Time
                    </h2>
                    <p class="text-base leading-relaxed text-white/60">
                        Pin your memories on the map, log your adventures, and
                        revisit every place that took your breath away.
                    </p>

                    <!-- Stats row -->
                    <div class="mt-8 flex gap-8 border-t border-white/10 pt-6">
                        <div>
                            <p class="text-2xl font-bold text-white">195+</p>
                            <p class="mt-0.5 text-xs text-white/50">
                                Countries
                            </p>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-white">∞</p>
                            <p class="mt-0.5 text-xs text-white/50">Memories</p>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-white">1</p>
                            <p class="mt-0.5 text-xs text-white/50">
                                Map for life
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
