import { Category } from "src/modules/category/entity/category.entity"

export class CreateEntryDto {
    title: string
    amount: number
    category: Category
}