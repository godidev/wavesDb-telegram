export enum BuoyDataKeys {
  PeriodoPico = 'Periodo de Pico',
  AlturaSignifOleaje = 'Altura Signif del Oleaje',
  DireccMediaProced = 'Direcc Media de Proced',
  DireccPicoProced = 'Direcc de pico de proced',
  PeriodoMedioTm02 = 'Periodo Medio Tm02',
}

export type formatedBuoys = {
  fecha: string
  datos: {
    [BuoyDataKeys.PeriodoPico]: number
    [BuoyDataKeys.AlturaSignifOleaje]: number
    [BuoyDataKeys.DireccMediaProced]: number
    [BuoyDataKeys.DireccPicoProced]: number
    [BuoyDataKeys.PeriodoMedioTm02]: number
  }
  station: string
}
