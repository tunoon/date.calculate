import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
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
    navigationBarTextStyle: "white"
  };

  state = {
    year: 0,
    day: 0,
    totalDay: 365
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
    const totalDay = months.reduce((acc, cur) => acc + cur);
    for (let i = 0; i < month; i++) {
      day += months[i];
    }
    this.setState({ year, day, totalDay });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { year, day, totalDay } = this.state;
    const dots = new Array(totalDay);
    return (
      <View className='homepage'>
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
      </View>
    );
  }
}
