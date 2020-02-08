import React from 'react'
import {
  View,
  PanResponder,
  StyleSheet,
} from 'react-native'

import Animated from 'react-native-reanimated'

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

export const VerticalSlider: React.FC<Props> = ({
  borderRadius,
  disabled,
  height,
  max,
  onChange,
  onComplete,
  value: initialValue,
  width,
  maximumTrackTintColor,
  minimumTrackTintColor,
  min,
  step,
}) => {
  let _moveStartValue: any = null

  const [gestureOffset, setValue] = React.useState(initialValue)

  const _changeState = (currentState: number): void => {
    setValue(currentState)
  }

  const _fetchNewValueFromGesture = (gestureState: any): number => {
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

  const panResponderInitial = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderGrant: () => {
      _moveStartValue = gestureOffset
    },
    onPanResponderMove: (event, gestureState) => {
      if (disabled) {
        return
      }
      const value = _fetchNewValueFromGesture(gestureState)
      _changeState(value)
      if (onChange) {
        onChange(value)
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      if (disabled) {
        return
      }
      const value = _fetchNewValueFromGesture(gestureState)
      _changeState(value)
      if (onComplete) {
        onComplete(value)
      }
    },
    onPanResponderTerminationRequest: () => false,
    onPanResponderTerminate: (event, gestureState) => {
      if (disabled) {
        return
      }
      const value = _fetchNewValueFromGesture(gestureState)
      _changeState(value)
      if (onComplete) {
        onComplete(value)
      }
    },
  })

  const [panResponder] = React.useState(panResponderInitial)

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
              height: (gestureOffset * height) / max,
              width,
              backgroundColor: minimumTrackTintColor,
            },
          ]}
        />
        <Animated.View
          style={{
            bottom: (gestureOffset * height) / max,
            height: 26,
            width: 26,
            borderRadius: 13,
            borderWidth: 10,
            backgroundColor: '#fff',
            borderColor: '#AB9E98',
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
            borderBottomColor: '#DDDDDD',
            zIndex: -1,
            transform: [{ rotate: '180deg' }],
          }}
        />
      </View>
    </View>
  )
}
