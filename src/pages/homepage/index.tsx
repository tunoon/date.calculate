import Taro, { Component, Config } from "@tarojs/taro";
import {
  View,
  Text,
  Swiper,
  SwiperItem,
  Picker,
  Button
} from "@tarojs/components";

import "./index.less";

export default class Homepage extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "时光倒数",
    navigationBarBackgroundColor: "#000000",
    navigationBarTextStyle: "white",
    disableScroll: true
  };

  onShareAppMessage() {
    return {
      title: "分享",
      path: "pages/homepage/index"
    };
  }

  state = {
    year: 0,
    day: 0,
    totalDay: 365,
    current: 0,
    start: "",
    end: "",
    dayInterval: 0
  };

  componentWillMount() {}

  componentDidMount() {
    function getIsLeapYear(year: number): boolean {
      return (!(year % 100) && !(year % 400)) || !!(year % 100 && !(year % 4));
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    let day = date.getDate();
    const isLeapYear = getIsLeapYear(year);
    const February = isLeapYear ? 29 : 28;
    const months = [31, February, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const totalDay = isLeapYear ? 366 : 365;
    for (let i = 0; i < month; i++) {
      day += months[i];
    }
    this.setState({ year, day, totalDay });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  handleChangeSwiper(e) {
    const { current } = e.detail;
    this.setState({ current });
    if (current === 0) {
      Taro.setNavigationBarTitle({ title: "时光倒数" });
    }
    if (current === 1) {
      Taro.setNavigationBarTitle({ title: "日期计算" });
    }
  }
  handleChangeCurrent(e) {
    const { current } = e.currentTarget.dataset;
    this.setState({ current });
    if (current === 0) {
      Taro.setNavigationBarTitle({ title: "时光倒数" });
    }
    if (current === 1) {
      Taro.setNavigationBarTitle({ title: "日期计算" });
    }
  }

  handleChangeDate = e => {
    console.log(e);
    const {
      currentTarget: {
        value,
        dataset: { type }
      }
    } = e;
    if (type === "start") {
      this.setState({ start: value });
    }
    if (type === "end") {
      this.setState({ end: value });
    }
  };

  handleCalculate() {
    const { start, end } = this.state;
    if (!start) {
      Taro.showModal({
        title: "提示",
        content: "请选择开始日期",
        showCancel: false
      });
      return;
    }
    if (!end) {
      Taro.showModal({
        title: "提示",
        content: "请选择结束日期",
        showCancel: false
      });
      return;
    }
    const timeInterval = Math.abs(
      new Date(end).getTime() - new Date(start).getTime()
    );
    const dayInterval = timeInterval / 3600000 / 24;
    this.setState({ dayInterval: dayInterval });
  }

  render() {
    const {
      year,
      day,
      totalDay,
      current,
      start,
      end,
      dayInterval
    } = this.state;
    const dots = new Array(totalDay);
    return (
      <View className='homepage'>
        <View className='tabs'>
          <Text
            className={current === 0 ? "tab active" : "tab"}
            data-current={0}
            onClick={e => this.handleChangeCurrent(e)}
          >
            时光倒数
          </Text>
          <Text
            className={current === 1 ? "tab active" : " tab"}
            data-current={1}
            onClick={e => this.handleChangeCurrent(e)}
          >
            日期计算
          </Text>
        </View>
        <Swiper
          className='swiper'
          onChange={e => this.handleChangeSwiper(e)}
          current={current}
        >
          <SwiperItem className='remainder'>
            <View className='header'>
              <Text className='text year'>{year}</Text>
              <Text className='text day'>{`${day}/${totalDay}`}</Text>
              <Text className='text percent'>{`${Math.round(
                (day / totalDay) * 100
              )}%`}</Text>
            </View>
            <View className='dots'>
              {dots.map((dot, index: number) =>
                index + 1 < day ? (
                  <View className='dot prev' key={dot}></View>
                ) : index + 1 == day ? (
                  <View className='dot curr' key={dot}></View>
                ) : (
                  <View className='dot next' key={dot}></View>
                )
              )}
            </View>
          </SwiperItem>
          <SwiperItem>
            <View className='calculate'>
              <Picker
                mode='date'
                value=''
                onChange={this.handleChangeDate}
                data-type='start'
              >
                <View className='option'>
                  <Text className='label'>开始日期</Text>
                  <View className='input'>{start}</View>
                </View>
              </Picker>
              <Picker
                mode='date'
                value=''
                onChange={this.handleChangeDate}
                data-type='end'
              >
                <View className='option'>
                  <Text className='label'>结束日期</Text>
                  <View className='input'>{end}</View>
                  <View></View>
                </View>
              </Picker>
              <Button
                className='button'
                hoverClass='hover'
                onClick={this.handleCalculate}
              >
                计算
              </Button>
              <View className='result'>相距{dayInterval}天</View>
            </View>
          </SwiperItem>
        </Swiper>
      </View>
    );
  }
}
