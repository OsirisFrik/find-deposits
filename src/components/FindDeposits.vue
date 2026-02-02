<script lang="ts" setup>
import { readCsv, writeCsv } from '@/lib/csv'
import { parseDate, validateDates } from '@/lib/date'
import { findPayments, type Data, type Result } from '@/lib/findPayments'
import { dataSchema } from '@/lib/schemaValidation'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Check,
  Circle,
  CombineIcon,
  Dot,
  DownloadIcon
} from 'lucide-vue-next'
import { v7 as uid } from 'uuid'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Button, ButtonInputFile } from './ui/button'
import { Card, CardContent } from './ui/card'
import {
  Stepper,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger
} from './ui/stepper'

enum Steps {
  DEPOSITS,
  PAYMENTS,
  PROCESS,
  RESULTS
}

const steps = [
  {
    step: Steps.DEPOSITS,
    title: 'Cargar depósitos'
  },
  {
    step: Steps.PAYMENTS,
    title: 'Cargar pagos'
  },
  {
    step: Steps.PROCESS,
    title: 'Procesar datos'
  },
  {
    step: Steps.RESULTS,
    title: 'Ver resultados'
  }
]

const currentStep = ref(Steps.DEPOSITS)
const deposits = ref<Data[]>([])
const payments = ref<Data[]>([])
const results = ref<Result[]>([])

async function onFileAdded(file: File, type: 'deposits' | 'payments') {
  const rawData = await readCsv<{ date: string; amount: number }>(file, {
    header: true,
    dynamicTyping: true,
    transform: (value, field) =>
      field === 'amount'
        ? Math.round(parseFloat(value.replace(',', '')) * 100)
        : value,
    skipEmptyLines: true
  })

  const { error, data } = dataSchema.safeParse(rawData)

  if (error) {
    error.issues.forEach((issue) => {
      toast.error(issue.message)
    })

    return
  }

  if (!validateDates(data.map((d) => d.date))) {
    toast.error('Los datos de fecha no son válidos (DD/MM/YYYY)')
    return
  }

  if (type === 'deposits') {
    deposits.value = data.map((item) => {
      return {
        ...item,
        dateValue: parseDate(item.date),
        id: uid()
      }
    })

    toast.success('Archivo cargado correctamente')
  }

  if (type === 'payments') {
    payments.value = data.map((item) => {
      return {
        ...item,
        dateValue: parseDate(item.date),
        id: uid()
      }
    })

    toast.success('Archivo cargado correctamente')
  }
}

function onProcess() {
  const rawResults = findPayments(deposits.value, payments.value)

  results.value = rawResults

  toast.success('Procesado correctamente')
  currentStep.value = Steps.RESULTS
}

function onDownload() {
  const result = writeCsv(results.value, {
    header: true,
    delimiter: ',',
    quotes: true
  })

  const blob = new Blob([result], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'resultados.csv'
  a.click()
}
</script>
<template>
  <Stepper
    v-model="currentStep"
    v-slot="{ modelValue, nextStep, prevStep, hasNext, hasPrev }"
    class="block w-full"
  >
    <div class="flex-start flex w-full gap-2">
      <StepperItem
        v-for="(step, index) in steps"
        :key="step.step"
        :step="step.step"
        v-slot="{ state }"
        class="relative flex w-full flex-col items-center justify-center"
      >
        <StepperSeparator
          v-if="step.step !== steps[steps.length - 1]?.step"
          class="bg-muted group-data-[state=completed]:bg-primary absolute top-4 right-[calc(-50%+10px)] left-[calc(50%+20px)] block h-0.5 shrink-0 rounded-full"
        />

        <StepperTrigger as-child>
          <Button
            :variant="
              state === 'completed' || state === 'active'
                ? 'default'
                : 'outline'
            "
            size="icon"
            class="z-10 shrink-0 rounded-full"
            :class="[
              state === 'active' &&
                'ring-ring ring-offset-background ring-2 ring-offset-2'
            ]"
            :disabled="state !== 'completed' && index >= (modelValue || 0)"
          >
            <Check v-if="state === 'completed'" class="size-5" />
            <Circle v-if="state === 'active'" />
            <Dot v-if="state === 'inactive'" />
          </Button>
        </StepperTrigger>

        <div class="flex flex-col items-center text-center">
          <StepperTitle
            class="text-sm font-semibold transition lg:text-base"
            :class="[state === 'active' && 'text-primary']"
          >
            {{ step.title }}
          </StepperTitle>
        </div>
      </StepperItem>
    </div>

    <Card class="mt-10">
      <CardContent
        v-if="currentStep === Steps.DEPOSITS"
        class="flex flex-col gap-3"
      >
        <div class="flex flex-col items-center">
          <h3 class="text-xl font-semibold">
            Cargue el archivo csv de depósitos
          </h3>
        </div>
        <ButtonInputFile
          accept="text/csv"
          @change="
            (file) => (file ? onFileAdded(file, 'deposits') : (deposits = []))
          "
        />
      </CardContent>
      <CardContent
        v-if="currentStep === Steps.PAYMENTS"
        class="flex flex-col gap-3"
      >
        <div class="flex flex-col items-center">
          <h3 class="text-xl font-semibold">Cargue el archivo csv de pagos</h3>
        </div>
        <ButtonInputFile
          accept="text/csv"
          @change="
            (file) => (file ? onFileAdded(file, 'payments') : (payments = []))
          "
        />
      </CardContent>
      <CardContent v-if="currentStep === Steps.PROCESS">
        <div class="flex flex-col items-center">
          <Button size="lg" @click="onProcess">
            <CombineIcon />
            Procesar resultados
          </Button>
        </div>
      </CardContent>
      <CardContent v-if="currentStep === Steps.RESULTS">
        <div class="flex flex-col items-center">
          <Button size="lg" @click="onDownload">
            <DownloadIcon />
            Descargar resultados
          </Button>
        </div>
      </CardContent>
    </Card>
    <div class="mt-2 flex justify-between">
      <Button
        variant="outline"
        :disabled="!hasPrev()"
        @click="() => prevStep()"
      >
        <ArrowLeftIcon />
        Volver
      </Button>
      <Button
        v-if="currentStep < Steps.PROCESS"
        :disabled="!hasNext()"
        @click="
          () => {
            if (currentStep === Steps.DEPOSITS && (!deposits || deposits.length === 0)) {
              toast.error('Debe cargar un archivo de depósitos')
              return
            }

            if (currentStep === Steps.PAYMENTS && (!payments || payments.length === 0)) {
              toast.error('Debe cargar un archivo de pagos')
              return
            }

            nextStep()
          }
        "
      >
        Siguiente
        <ArrowRightIcon />
      </Button>
    </div>
  </Stepper>
</template>
