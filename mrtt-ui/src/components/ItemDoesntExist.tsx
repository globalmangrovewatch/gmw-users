import { RowCenterCenter } from '@/components/ui/layout'
import language from '@/language'

/** "This <item> doesn't exist", for a detail page whose item the API can't find. */
function ItemDoesntExist({ item }: { item: string }) {
  return <RowCenterCenter>{language.error.getItemDoesntExistMessage(item)}</RowCenterCenter>
}

export default ItemDoesntExist
