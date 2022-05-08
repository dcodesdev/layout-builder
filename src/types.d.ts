export interface User {
  id: string
  name: string
}

export interface Rectangular {
  id: string
  x: number
  y: number
  width: number
  height: number
  color: string
}

export interface Layout {
  id: string
  name: string
  user_id: string
  rects: Rectangular[]
}
