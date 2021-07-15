import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useSnackbar } from 'notistack'
import { Loader } from 'google-maps'
import io from 'socket.io-client'
import axios from 'axios'

import { Box } from '@material-ui/core'

import MapControl from './MapControl'
import OrderInformation from './OrderInformation'

const loader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY)
const socket = io(process.env.REACT_APP_MICRO_MAPPING_URL)

const Mapping = () => {
  const { id } = useParams()
  const snackbar = useSnackbar()

  const [order, setOrder] = useState()
  const [map, setMap] = useState()
  const [startMarker, setStartMarker] = useState()
  const [endMarker, setEndMarker] = useState()
  const [position, setPosition] = useState()

  /*
  busca a order e cria o mapa para a order respectiva
  */
  useEffect(() => {
    const bootstrapComponent = async () => {
      // Busca a order
      const { data } = await axios.get(`${process.env.REACT_APP_MICRO_MAPPING_URL}/orders/${id}`)
      setOrder(data)

      // Cria o objeto position
      const [lat, long] = data.location_geo
      const position = {lat: parseFloat(lat), lng: parseFloat(long)};

      // Carrega o mapa do google
      window.google = await loader.load()


      // Cria o mapa
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: position,
        zoom: 15
      })


      // Crio o ponto de inicio
      const start = new window.google.maps.Marker({
        title: 'Início',
        icon: 'http://maps.google.com/mapfiles/kml/pal4/icon7.png'
      });

      // Crio o ponto de termino
      const end = new window.google.maps.Marker({
        position: position,
        map: map,
        title: 'Destino'
      });

      // Atualizo o state
      setMap(map)
      setStartMarker(start)
      setEndMarker(end)
    }

    bootstrapComponent()
  }, [id])


  /*
  Fica responsável por obter novas posições via socket.io
  e atualizar a posição
  */
  useEffect(() => {
    // Fico ouvindo uma nova position
    socket.on(`order.${id}.new-position`, payload => {
      console.log('Socket.on, current position ', payload)
      setPosition(payload)
    })
  }, [id])


  /*
  Fica responsável por quando uma posições nova chegar, atualizar
  o mapa e se o entregador chegou ao destino então mostra uma mensagem
  na tela
  */
  useEffect(() => {
    if (!map || !position) return;

    if (position.lat === 0 && position.lng === 0) {
      snackbar.enqueueSnackbar('Motorista chegou ao destino', {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        }
      })
      return
    }


    startMarker.setPosition({ ...position })
    startMarker.setMap(map)

    const bounds = new window.google.maps.LatLngBounds()
    bounds.extend(startMarker.getPosition())
    bounds.extend(endMarker.getPosition())
    map.fitBounds(bounds)

  }, [map, position])

  return (
    <div id={'map'} style={{width: '100%', minHeight: '100vh'}}>
      {
        map && (
          <MapControl map={map} position={window.google.maps.ControlPosition.TOP_RIGHT}>
            <Box m={'10px'}>
              <OrderInformation order={order} />
            </Box>
          </MapControl>
        )
      }
    </div>
  )
}

export default Mapping