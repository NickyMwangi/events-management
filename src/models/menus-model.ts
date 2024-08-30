export interface MenusModel {
  code: string
  name: string
  title: string
  tooltip: string
  iconName: string
  route: string
  routeTitle: string
  ordering: number
  parent: string | null
  level: number
  expandOnly: boolean
  isVisible: boolean
}