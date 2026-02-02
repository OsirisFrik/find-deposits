<script lang="ts" setup>
import { DownloadIcon } from 'lucide-vue-next'
import Papa from 'papaparse'
import ExampleTable from './ExampleTable.vue'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'

function onDownload() {
  const data = [
    {
      date: '1/12/2025',
      amount: 10500
    }
  ]
  const result = Papa.unparse(data, {
    header: true,
    delimiter: ',',
    quotes: true
  })

  const blob = new Blob([result], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'ejemplo.csv'
  a.click()
}
</script>
<template>
  <Dialog>
    <DialogTrigger>
      <Button variant="link"> Ver ejemplo </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogTitle> Como usar </DialogTitle>
      <p>
        Por favor, cargue los archivos de depósitos y pagos requeridos para el
        cotejamiento de depósitos con el siguiente formato.
      </p>
      <Card>
        <CardContent>
          <ExampleTable />
        </CardContent>
      </Card>

      <p><strong>date:</strong> Fecha de pago en formato DD/MM/AAAA.</p>
      <p>
        <strong>amount:</strong> Monto de pago en formato numérico con máximo 2
        decimales.
      </p>
      <DialogFooter>
        <Button variant="outline" @click="onDownload">
          <DownloadIcon />
          Descargar template
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
