export type SliderProps = {
    value: number
    disabled: boolean
    min: number
    max: number
    onChange: (value: number) => void
    onComplete: (value: number) => void
    width: number
    height: number
    borderRadius: number
    maximumTrackTintColor?: string
    minimumTrackTintColor?: string
    step?: number
    animationDuration?: number
  }