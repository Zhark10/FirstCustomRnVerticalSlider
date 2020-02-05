import React from 'react'
import {
  View,
  Text,
  PanResponder,
  StyleSheet,
} from 'react-native'

import Animated, { Easing } from 'react-native-reanimated'

type Props = {
  value: number
  disabled: boolean
  min: number
  max: number
  onChange: (value: number) => void
  onComplete: (value: number) => void
  width: number
  height: number
  borderRadius: number
  maximumTrackTintColor: string
  minimumTrackTintColor: string
  showBallIndicator: boolean
  step?: number
  animationDuration?: number
}

export const VerticalSlider: React.FC<Props> = (props) => {
  let _moveStartValue: any = null

  const [value, setValue] = React.useState(props.value)
  const [sliderHeight] = React.useState(new Animated.Value(0))
  const [ballHeight] = React.useState(new Animated.Value(0))

  const panResponderInitial = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderGrant: () => {
      _moveStartValue = value
    },
    onPanResponderMove: (event, gestureState) => {
      if (props.disabled) {
        return
      }
      const value = _fetchNewValueFromGesture(gestureState)
      _changeState(value)
      if (props.onChange) {
        props.onChange(value)
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      if (props.disabled) {
        return
      }
      const value = _fetchNewValueFromGesture(gestureState)
      _changeState(value)
      if (props.onComplete) {
        props.onComplete(value)
      }
    },
    onPanResponderTerminationRequest: () => false,
    onPanResponderTerminate: (event, gestureState) => {
      if (props.disabled) {
        return
      }
      const value = _fetchNewValueFromGesture(gestureState)
      _changeState(value)
      if (props.onComplete) {
        props.onComplete(value)
      }
    },
  })

  const [panResponder] = React.useState(panResponderInitial)


  const _fetchNewValueFromGesture = (gestureState: any): number => {
    const { min, max, step, height } = props
    const ratio = -gestureState.dy / height
    const diff = max - min
    if (step) {
      return Math.max(
        min,
        Math.min(
          max,
          _moveStartValue + Math.round((ratio * diff) / step) * step
        )
      )
    }
    const value = Math.max(min, _moveStartValue + ratio * diff)
    return Math.floor(value * 100) / 100
  }

  const _getSliderHeight = (value: number): number => {
    const { min, max, height } = props
    return ((value - min) * height) / (max - min)
  }

  const _changeState = (value: number): void => {
    const { animationDuration } = props
    Animated.timing(sliderHeight, {
      toValue: sliderHeight,
      easing: Easing.linear,
      duration: animationDuration || 0,
    }).start()
    setValue(value)
  }

  React.useEffect(() => {
    if (props.value) {
      _changeState(value)
    }
  }, [])

  const {
    width,
    height,
    borderRadius,
    maximumTrackTintColor,
    minimumTrackTintColor,
  } = props
  return (
    <View style={[{ height, width, borderRadius }]}>
      <View
        style={[
          styles.container,
          styles.shadow,
          {
            height,
            width,
            borderRadius,
            backgroundColor: maximumTrackTintColor || '#ECECEC',
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={[
            styles.slider,
            {
              height: sliderHeight,
              width,
              backgroundColor: minimumTrackTintColor,
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  ball: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballText: {
    fontWeight: '900',
  },
  container: {
    overflow: 'hidden',
  },
  slider: {
    position: 'absolute',
    bottom: 0,
  },
})
