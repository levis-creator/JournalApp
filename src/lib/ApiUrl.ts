export const API={
    INTERNAL: process.env.NEXT_PUBLIC_INTERNAL_API_URL
}
export const ENDPOINTS={
    AUTH:{
        SIGNIN:'/api/auth/signin',
        SIGNUP:'/api/auth/signup',
        SIGNOUT:'/api/auth/signout',
        VERIFY:'/api/auth/verify'
    },
    JOURNALS:'/api/entries',
    CATEGORIES:'/api/categories',
    TAGS:'/api/tags'
}