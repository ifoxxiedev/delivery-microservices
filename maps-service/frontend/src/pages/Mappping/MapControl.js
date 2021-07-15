import { useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'

const MapControl = ({ map, position, children }) => {

  const controlDiv = useMemo(() => document.createElement('div'), [])

  useEffect(() => {
    if (map && position) {
      map.controls[position].push(controlDiv)
    }
  }, [map, position])

  return createPortal(children, controlDiv)
}

export default MapControl