import { getActivePlans } from '~/lib/db/queries/subscription-query'

export default defineEventHandler(() => getActivePlans())
