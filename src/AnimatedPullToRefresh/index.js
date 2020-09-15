import React, { Component } from 'react'
import { View, PanResponder, Animated, Dimensions, UIManager, LayoutAnimation, Easing } from 'react-native'
import LottieView from 'lottie-react-native'
import PropTypes from 'prop-types';

const vw = Dimensions.get('window').width * 0.01
const vh = Dimensions.get('window').height * 0.01


class AnimatedPullToRefresh extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            refreshHeight: new Animated.Value(0),
            isScrollFree: false,
            showPullAnim: false,
            isRefreshAnimationStarted: false,
            isRefreshAnimationEnded: false,
            initAnimationProgress: new Animated.Value(0),
            repeatAnimationProgress: new Animated.Value(0),
            finalAnimationProgress: new Animated.Value(0),
        }

        this.DURATION = this.props.duration ?? 1500
        this.PULLHEIGHT = this.props.pullHeight ?? 10 * vh

        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }



    UNSAFE_componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderEnd,
            onPanResponderTerminate: this._handlePanResponderEnd,
            onPanResponderGrant: (evt, gestureState) => {

            },
        });
    }




    UNSAFE_componentWillReceiveProps(props) {

        if (this.props.isRefreshing !== props.isRefreshing) {
            if (props.isRefreshing && !this.state.showPullAnim) {
                this.onRefresh()

            }

        }

    }

    _handleStartShouldSetPanResponder = (e, gestureState) => {
        return !this.state.isScrollFree;
    }

    _handleMoveShouldSetPanResponder = (e, gestureState) => {
        return !this.state.isScrollFree;
    }


    _handlePanResponderMove = (e, gestureState) => {
        if (!this.props.isRefreshing) {

            if ((gestureState.dy >= 0 && this.state.scrollY._value === 0)) {

                this.state.refreshHeight.setValue(-1 * gestureState.dy * .35);


                if (!this.state.showPullAnim)
                    this.setState({ showPullAnim: true })
            } else {

                this.refs.scrollComponentRef.scrollTo({ y: -1 * gestureState.dy, animated: true });
                if (this.state.showPullAnim) {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                    this.setState({ showPullAnim: false })
                }

            }
        }
    }

    _handlePanResponderEnd = (e, gestureState) => {
        if (!this.props.isRefreshing) {
            if (this.state.refreshHeight._value <= -this.PULLHEIGHT) {
                this.onScrollRelease();
                Animated.parallel([
                    Animated.spring(this.state.refreshHeight, {
                        toValue: -this.PULLHEIGHT
                    }),
                    Animated.timing(this.state.initAnimationProgress, {
                        toValue: 1,
                        duration: 1000
                    })
                ]).start(() => {
                    this.state.initAnimationProgress.setValue(0);
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                    this.setState({ isRefreshAnimationStarted: true, showPullAnim: false });
                    this.onRepeatAnimation();

                })
            } else if (this.state.refreshHeight._value <= 0) {
                Animated.spring(this.state.refreshHeight, {
                    toValue: 0
                }).start(() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                    this.setState({ showPullAnim: false })
                });
            }

            if (this.state.scrollY._value > 0) {
                this.setState({ isScrollFree: true });
            }
        }
    }

    onRepeatAnimation = () => {
        this.state.repeatAnimationProgress.setValue(0);

        Animated.timing(this.state.repeatAnimationProgress, {
            toValue: 1,
            easing: Easing.linear,
            duration: this.DURATION
        }).start(() => {
            if (this.props.isRefreshing) {
                this.onRepeatAnimation();
            } else {
                this.state.repeatAnimationProgress.setValue(0);
                this.onEndAnimation();
            }
        })
    }

    onEndAnimation = () => {
        this.setState({ isRefreshAnimationEnded: true });
        Animated.sequence([
            Animated.timing(this.state.finalAnimationProgress, {
                toValue: 1,
                easing: Easing.linear,
                duration: this.DURATION
            }),
            Animated.spring(this.state.refreshHeight, {
                toValue: 0,
                bounciness: 12
            })
        ]).start(() => {
            this.state.finalAnimationProgress.setValue(0);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            this.setState({
                isRefreshAnimationEnded: false,
                isRefreshAnimationStarted: false,
                showPullAnim: false
            })
        })
    }


    onScrollRelease = () => {
        if (!this.props.isRefreshing) {
            this.props.onRefresh();
        }
    }

    isScrolledToTop = () => {
        if (this.state.scrollY._value === 0 && this.state.isScrollFree) {
            this.setState({ isScrollFree: false });
        }
    }




    onRefresh = () => {

        Animated.parallel([
            Animated.spring(this.state.refreshHeight, {
                toValue: -this.PULLHEIGHT,
                bounciness: 12,
            }),
            Animated.timing(this.state.initAnimationProgress, {
                toValue: 1,
                duration: this.DURATION,
                easing: Easing.linear
            })
        ]).start(() => {
            this.state.initAnimationProgress.setValue(0);
            this.setState({ isRefreshAnimationStarted: true, showPullAnim: false });
            this.onRepeatAnimation();

        })

    }


    _renderAnimations = (animationStyle, animateProgress) => {

        if (this.state.showPullAnim) {

            return <Animated.View style={[
                animationStyle,
            ]}>
                <LottieView
                    source={this.props.pullAnimationSource}
                    progress={animateProgress}
                />
            </Animated.View>

        }
        else {



            if (this.props.isRefreshing && !this.state.isRefreshAnimationStarted) {
                return <Animated.View style={[
                    animationStyle,
                ]}>
                    <LottieView
                        style={[{ opacity: (this.props.isRefreshing && !this.state.isRefreshAnimationStarted) ? 1 : 0 }]}
                        source={this.props.startRefreshAnimationSource}
                        progress={this.state.initAnimationProgress}
                    />
                </Animated.View>
            }

            if (this.state.isRefreshAnimationStarted && !this.state.isRefreshAnimationEnded) {
                return <Animated.View style={[
                    animationStyle,
                ]}>
                    <LottieView
                        style={[{ opacity: this.state.isRefreshAnimationStarted && !this.state.isRefreshAnimationEnded ? 1 : 0 }]}
                        source={this.props.refreshAnimationSource}
                        progress={this.state.repeatAnimationProgress}
                    />
                </Animated.View>
            }

            if (this.state.isRefreshAnimationEnded) {
                return <Animated.View style={[
                    animationStyle,
                ]}>
                    <LottieView
                        style={[{ opacity: this.state.isRefreshAnimationEnded ? 1 : 0 }]}
                        source={this.props.endRefreshAnimationSource}
                        progress={this.state.finalAnimationProgress}
                    />
                </Animated.View>
            }

            else {
                return null
            }

        }
    }



    render() {



        let onScrollEvent = (event) => {
            this.state.scrollY.setValue(event.nativeEvent.contentOffset.y)
        };

        let animateHeight = this.state.refreshHeight.interpolate({
            inputRange: [-this.PULLHEIGHT, 0],
            outputRange: [this.PULLHEIGHT, 0]
        });

        let animateProgress = this.state.refreshHeight.interpolate({
            inputRange: [-this.PULLHEIGHT, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });



        const animationStyle = {
            position: 'absolute',
            backgroundColor: this.props.backgroundColor,
            width: Dimensions.get('window').width,
            height: animateHeight
        }


        return (
            <View
                style={{
                    width: Dimensions.get('window').width,
                }}
                {...this._panResponder.panHandlers}
            >

                {
                    this._renderAnimations(animationStyle, animateProgress)
                }


                <Animated.ScrollView ref='scrollComponentRef'
                    scrollEnabled={this.state.isScrollFree}
                    onScroll={onScrollEvent}
                    scrollEventThrottle={16}
                    bounces={false}
                    onTouchEnd={this.isScrolledToTop}
                    onScrollEndDrag={this.isScrolledToTop}
                    style={{
                        transform: [{
                            translateY: !this.props.isRefreshing && !this.state.showPullAnim && this.state.refreshHeight >= 0 ? 0 : animateHeight
                        }]
                    }}
                >
                    {React.cloneElement(this.props.renderElement, {
                        scrollEnabled: false,
                        ref: 'scrollComponentRef',
                        key: 'scm'
                    })}


                </Animated.ScrollView>
            </View>
        );
    }
}


AnimatedPullToRefresh.propTypes = {
    isRefreshing: PropTypes.bool,
    onRefresh: PropTypes.func,
    pullHeight: PropTypes.number,
    backgroundColor: PropTypes.string,
    duration: PropTypes.number,
    pullAnimationSource: PropTypes.any,
    startRefreshAnimationSource: PropTypes.any,
    refreshAnimationSource: PropTypes.any,
    endRefreshAnimationSource: PropTypes.any,
};



export default AnimatedPullToRefresh