import Taro, { Component, Config } from '@tarojs/taro';
import {
  View,
  Text,
  Swiper,
  SwiperItem,
  Picker,
  Button,
  Input
} from '@tarojs/components';

import './index.less';

const Title = {
  0: '时光倒数',
  1: '日期计算',
  2: '日期推算'
};

export default class Homepage extends Component {
  config: Config = {
    navigationBarTitleText: '时光倒数',
    navigationBarBackgroundColor: '#000000',
    navigationBarTextStyle: 'white',
    disableScroll: true
  };

  onShareAppMessage() {
    return {
      title: '分享',
      path: 'pages/homepage/index'
    };
  }

  state = {
    year: 0,
    day: 0,
    totalDay: 365,
    current: 0,
    start: '',
    end: '',
    dayInterval: 0,
    incept: '',
    inceptInterval: 0,
    inceptDate: ''
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
    Taro.setNavigationBarTitle({ title: Title[current] });
  }
  handleChangeCurrent(e) {
    const { current } = e.currentTarget.dataset;
    this.setState({ current });
    Taro.setNavigationBarTitle({ title: Title[current] });
  }

  handleChangeDate = e => {
    const {
      currentTarget: {
        value,
        dataset: { type }
      }
    } = e;
    if (type === 'start') {
      this.setState({ start: value });
    }
    if (type === 'end') {
      this.setState({ end: value });
    }
    if (type === 'incept') {
      this.setState({ incept: value });
    }
  };

  handleCalculate() {
    const { start, end } = this.state;
    if (!start) {
      Taro.showModal({
        title: '出错啦！',
        content: '请选择开始日期',
        showCancel: false
      });
      return;
    }
    if (!end) {
      Taro.showModal({
        title: '出错啦！',
        content: '请选择结束日期',
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

  handleInput = e => {
    this.setState({ inceptInterval: e.detail.value });
  };

  handleReckon = e => {
    const {
      currentTarget: {
        dataset: { type }
      }
    } = e;
    const { incept, inceptInterval } = this.state;
    if (!incept) {
      Taro.showModal({
        title: '出错啦！',
        content: '请选择起始日期',
        showCancel: false
      });
      return;
    }
    if (!inceptInterval) {
      Taro.showModal({
        title: '出错啦！',
        content: '请输入相距天数',
        showCancel: false
      });
      return;
    }

    let result = new Date(incept).getTime();

    if (type === 'prev') {
      if (new Date(incept).getTime() / 360000 / 24 - inceptInterval <= 0) {
        Taro.showModal({
          title: '出错啦！',
          content: '输入的天数超出计算范围',
          showCancel: false
        });
        return;
      }
      result -= inceptInterval * 3600000 * 24;
    }
    if (type === 'next') {
      result += inceptInterval * 3600000 * 24;
    }
    const resultDate = new Date(result);
    const year = resultDate.getFullYear();
    if (isNaN(year)) {
      Taro.showModal({
        title: '出错啦！',
        content: '输入的天数超出计算范围',
        showCancel: false
      });
      return;
    }
    const month =
      resultDate.getMonth() + 1 < 10
        ? '0' + `${resultDate.getMonth() + 1}`
        : resultDate.getMonth() + 1;
    const day =
      resultDate.getDate() < 10
        ? '0' + `${resultDate.getDate()}`
        : resultDate.getDate();
    this.setState({
      inceptDate: `${year}-${month}-${day}`
    });
  };

  render() {
    const {
      year,
      day,
      totalDay,
      current,
      start,
      end,
      dayInterval,
      incept,
      inceptInterval,
      inceptDate
    } = this.state;
    const dots = new Array(totalDay);

    const remainder = (
      <View className='remainder'>
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
      </View>
    );

    const calculate = (
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
    );

    const reckon = (
      <View className='reckon'>
        <Picker
          mode='date'
          value=''
          onChange={this.handleChangeDate}
          data-type='incept'
        >
          <View className='option'>
            <Text className='label'>起始日期</Text>
            <View className='input'>{incept}</View>
          </View>
        </Picker>
        <View className='option'>
          <Text className='label'>相距天数</Text>
          <Input className='input' type='number' onInput={this.handleInput}>
            {inceptInterval}
          </Input>
        </View>
        <View className='wrap'>
          <Button
            className='button'
            hoverClass='hover'
            data-type='prev'
            onClick={this.handleReckon}
          >
            向前
          </Button>
          <Button
            className='button'
            hoverClass='hover'
            data-type='next'
            onClick={this.handleReckon}
          >
            向后
          </Button>
        </View>
        <View className='result'>目标日期 {inceptDate}</View>
      </View>
    );

    return (
      <View className='homepage'>
        <View className='tabs'>
          <Text
            className={current === 0 ? 'tab active' : 'tab'}
            data-current={0}
            onClick={e => this.handleChangeCurrent(e)}
          >
            {Title[0]}
          </Text>
          <Text
            className={current === 1 ? 'tab active' : ' tab'}
            data-current={1}
            onClick={e => this.handleChangeCurrent(e)}
          >
            {Title[1]}
          </Text>
          <Text
            className={current === 2 ? 'tab active' : ' tab'}
            data-current={2}
            onClick={e => this.handleChangeCurrent(e)}
          >
            {Title[2]}
          </Text>
        </View>
        <Swiper
          className='swiper'
          onChange={e => this.handleChangeSwiper(e)}
          current={current}
        >
          <SwiperItem>{remainder}</SwiperItem>
          <SwiperItem>{calculate}</SwiperItem>
          <SwiperItem>{reckon}</SwiperItem>
        </Swiper>
      </View>
    );
  }
}
