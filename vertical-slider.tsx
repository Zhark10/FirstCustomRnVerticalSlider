import React from 'react'
import {
  View,
  PanResponder,
  StyleSheet,
} from 'react-native'

import Animated from 'react-native-reanimated'

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
  maximumTrackTintColor?: string
  minimumTrackTintColor?: string
  step?: number
  animationDuration?: number
}

export const VerticalSlider: React.FC<Props> = (props) => {
  let _moveStartValue: any = null

  const [value, setValue] = React.useState(props.value)

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

  const _changeState = (value: number): void => {
    setValue(value)
  }

  React.useEffect(() => {
    _changeState(value)
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
          {
            height,
            width,
            borderRadius,
            backgroundColor: maximumTrackTintColor,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Animated.View
          style={[
            styles.slider,
            {
              height: (value * height) / props.max,
              width,
              backgroundColor: minimumTrackTintColor,
            },
          ]}
        />
        <Animated.View
          style={{
            bottom: (value * height) / props.max,
            height: 26,
            width: 26,
            borderRadius: 13,
            borderWidth: 10,
            backgroundColor: 'green',
            borderColor: 'blue',
            position: 'absolute',
          }}
        />
        <View
          style={{
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: 5,
            borderRightWidth: 5,
            borderBottomWidth: 70,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'yellow',
            zIndex: -1,
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ball: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballText: {
    fontWeight: '900',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    position: 'absolute',
    bottom: 0,
  },
})
