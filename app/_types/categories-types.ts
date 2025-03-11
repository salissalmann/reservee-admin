
export interface ICategory {
    id: number | string,
    name: string
    description: string
    logo: string | null,
    logoFile: File | null,
    is_published?: boolean
}