'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function boostForm(formId: string, productId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: 'Unauthorized' }
    }

    // @ts-ignore
    const { data, error } = await supabase.rpc('purchase_boost', {
        p_user_id: user.id,
        p_form_id: formId,
        p_product_id: productId
    })

    if (error) {
        console.error('Boost purchase error:', error)
        return { success: false, message: 'Transaction failed' }
    }

    // data returned from RPC is JSON
    const result = data as { success: boolean; message: string }

    if (!result.success) {
        return { success: false, message: result.message }
    }

    revalidatePath('/forms')
    // Also revalidate where credits are shown
    revalidatePath('/', 'layout')
    return { success: true, message: 'Boost activated!' }
}

export async function getBoostProducts() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('boost_products')
        .select('*')
        .eq('is_active', true)
        .order('price_credits')

    return data || []
}
