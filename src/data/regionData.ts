// 省市区数据（简化版，包含主要省市）
export interface RegionItem {
  value: string
  label: string
  children?: RegionItem[]
}

export const regionData: RegionItem[] = [
  {
    value: '北京市',
    label: '北京市',
    children: [
      { value: '东城区', label: '东城区' },
      { value: '西城区', label: '西城区' },
      { value: '朝阳区', label: '朝阳区' },
      { value: '丰台区', label: '丰台区' },
      { value: '石景山区', label: '石景山区' },
      { value: '海淀区', label: '海淀区' },
      { value: '门头沟区', label: '门头沟区' },
      { value: '房山区', label: '房山区' },
      { value: '通州区', label: '通州区' },
      { value: '顺义区', label: '顺义区' },
      { value: '昌平区', label: '昌平区' },
      { value: '大兴区', label: '大兴区' },
      { value: '怀柔区', label: '怀柔区' },
      { value: '平谷区', label: '平谷区' },
      { value: '密云区', label: '密云区' },
      { value: '延庆区', label: '延庆区' }
    ]
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      { value: '黄浦区', label: '黄浦区' },
      { value: '徐汇区', label: '徐汇区' },
      { value: '长宁区', label: '长宁区' },
      { value: '静安区', label: '静安区' },
      { value: '普陀区', label: '普陀区' },
      { value: '虹口区', label: '虹口区' },
      { value: '杨浦区', label: '杨浦区' },
      { value: '浦东新区', label: '浦东新区' },
      { value: '闵行区', label: '闵行区' },
      { value: '宝山区', label: '宝山区' },
      { value: '嘉定区', label: '嘉定区' },
      { value: '金山区', label: '金山区' },
      { value: '松江区', label: '松江区' },
      { value: '青浦区', label: '青浦区' },
      { value: '奉贤区', label: '奉贤区' },
      { value: '崇明区', label: '崇明区' }
    ]
  },
  {
    value: '广东省',
    label: '广东省',
    children: [
      { value: '广州市', label: '广州市' },
      { value: '深圳市', label: '深圳市' },
      { value: '珠海市', label: '珠海市' },
      { value: '汕头市', label: '汕头市' },
      { value: '佛山市', label: '佛山市' },
      { value: '韶关市', label: '韶关市' },
      { value: '湛江市', label: '湛江市' },
      { value: '肇庆市', label: '肇庆市' },
      { value: '江门市', label: '江门市' },
      { value: '茂名市', label: '茂名市' },
      { value: '惠州市', label: '惠州市' },
      { value: '梅州市', label: '梅州市' },
      { value: '汕尾市', label: '汕尾市' },
      { value: '河源市', label: '河源市' },
      { value: '阳江市', label: '阳江市' },
      { value: '清远市', label: '清远市' },
      { value: '东莞市', label: '东莞市' },
      { value: '中山市', label: '中山市' },
      { value: '潮州市', label: '潮州市' },
      { value: '揭阳市', label: '揭阳市' },
      { value: '云浮市', label: '云浮市' }
    ]
  },
  {
    value: '浙江省',
    label: '浙江省',
    children: [
      { value: '杭州市', label: '杭州市' },
      { value: '宁波市', label: '宁波市' },
      { value: '温州市', label: '温州市' },
      { value: '嘉兴市', label: '嘉兴市' },
      { value: '湖州市', label: '湖州市' },
      { value: '绍兴市', label: '绍兴市' },
      { value: '金华市', label: '金华市' },
      { value: '衢州市', label: '衢州市' },
      { value: '舟山市', label: '舟山市' },
      { value: '台州市', label: '台州市' },
      { value: '丽水市', label: '丽水市' }
    ]
  },
  {
    value: '江苏省',
    label: '江苏省',
    children: [
      { value: '南京市', label: '南京市' },
      { value: '无锡市', label: '无锡市' },
      { value: '徐州市', label: '徐州市' },
      { value: '常州市', label: '常州市' },
      { value: '苏州市', label: '苏州市' },
      { value: '南通市', label: '南通市' },
      { value: '连云港市', label: '连云港市' },
      { value: '淮安市', label: '淮安市' },
      { value: '盐城市', label: '盐城市' },
      { value: '扬州市', label: '扬州市' },
      { value: '镇江市', label: '镇江市' },
      { value: '泰州市', label: '泰州市' },
      { value: '宿迁市', label: '宿迁市' }
    ]
  },
  {
    value: '四川省',
    label: '四川省',
    children: [
      { value: '成都市', label: '成都市' },
      { value: '自贡市', label: '自贡市' },
      { value: '攀枝花市', label: '攀枝花市' },
      { value: '泸州市', label: '泸州市' },
      { value: '德阳市', label: '德阳市' },
      { value: '绵阳市', label: '绵阳市' },
      { value: '广元市', label: '广元市' },
      { value: '遂宁市', label: '遂宁市' },
      { value: '内江市', label: '内江市' },
      { value: '乐山市', label: '乐山市' },
      { value: '南充市', label: '南充市' },
      { value: '眉山市', label: '眉山市' },
      { value: '宜宾市', label: '宜宾市' },
      { value: '广安市', label: '广安市' },
      { value: '达州市', label: '达州市' },
      { value: '雅安市', label: '雅安市' },
      { value: '巴中市', label: '巴中市' },
      { value: '资阳市', label: '资阳市' }
    ]
  },
  {
    value: '湖北省',
    label: '湖北省',
    children: [
      { value: '武汉市', label: '武汉市' },
      { value: '黄石市', label: '黄石市' },
      { value: '十堰市', label: '十堰市' },
      { value: '宜昌市', label: '宜昌市' },
      { value: '襄阳市', label: '襄阳市' },
      { value: '鄂州市', label: '鄂州市' },
      { value: '荆门市', label: '荆门市' },
      { value: '孝感市', label: '孝感市' },
      { value: '荆州市', label: '荆州市' },
      { value: '黄冈市', label: '黄冈市' },
      { value: '咸宁市', label: '咸宁市' },
      { value: '随州市', label: '随州市' }
    ]
  },
  {
    value: '湖南省',
    label: '湖南省',
    children: [
      { value: '长沙市', label: '长沙市' },
      { value: '株洲市', label: '株洲市' },
      { value: '湘潭市', label: '湘潭市' },
      { value: '衡阳市', label: '衡阳市' },
      { value: '邵阳市', label: '邵阳市' },
      { value: '岳阳市', label: '岳阳市' },
      { value: '常德市', label: '常德市' },
      { value: '张家界市', label: '张家界市' },
      { value: '益阳市', label: '益阳市' },
      { value: '郴州市', label: '郴州市' },
      { value: '永州市', label: '永州市' },
      { value: '怀化市', label: '怀化市' },
      { value: '娄底市', label: '娄底市' },
      { value: '湘西州', label: '湘西州' }
    ]
  },
  {
    value: '陕西省',
    label: '陕西省',
    children: [
      { value: '西安市', label: '西安市' },
      { value: '铜川市', label: '铜川市' },
      { value: '宝鸡市', label: '宝鸡市' },
      { value: '咸阳市', label: '咸阳市' },
      { value: '渭南市', label: '渭南市' },
      { value: '延安市', label: '延安市' },
      { value: '汉中市', label: '汉中市' },
      { value: '榆林市', label: '榆林市' },
      { value: '安康市', label: '安康市' },
      { value: '商洛市', label: '商洛市' }
    ]
  },
  {
    value: '河南省',
    label: '河南省',
    children: [
      { value: '郑州市', label: '郑州市' },
      { value: '开封市', label: '开封市' },
      { value: '洛阳市', label: '洛阳市' },
      { value: '平顶山市', label: '平顶山市' },
      { value: '安阳市', label: '安阳市' },
      { value: '鹤壁市', label: '鹤壁市' },
      { value: '新乡市', label: '新乡市' },
      { value: '焦作市', label: '焦作市' },
      { value: '濮阳市', label: '濮阳市' },
      { value: '许昌市', label: '许昌市' },
      { value: '漯河市', label: '漯河市' },
      { value: '三门峡市', label: '三门峡市' },
      { value: '南阳市', label: '南阳市' },
      { value: '商丘市', label: '商丘市' },
      { value: '信阳市', label: '信阳市' },
      { value: '周口市', label: '周口市' },
      { value: '驻马店市', label: '驻马店市' }
    ]
  },
  {
    value: '山东省',
    label: '山东省',
    children: [
      { value: '济南市', label: '济南市' },
      { value: '青岛市', label: '青岛市' },
      { value: '淄博市', label: '淄博市' },
      { value: '枣庄市', label: '枣庄市' },
      { value: '东营市', label: '东营市' },
      { value: '烟台市', label: '烟台市' },
      { value: '潍坊市', label: '潍坊市' },
      { value: '济宁市', label: '济宁市' },
      { value: '泰安市', label: '泰安市' },
      { value: '威海市', label: '威海市' },
      { value: '日照市', label: '日照市' },
      { value: '莱芜市', label: '莱芜市' },
      { value: '临沂市', label: '临沂市' },
      { value: '德州市', label: '德州市' },
      { value: '聊城市', label: '聊城市' },
      { value: '滨州市', label: '滨州市' },
      { value: '菏泽市', label: '菏泽市' }
    ]
  },
  {
    value: '福建省',
    label: '福建省',
    children: [
      { value: '福州市', label: '福州市' },
      { value: '厦门市', label: '厦门市' },
      { value: '莆田市', label: '莆田市' },
      { value: '三明市', label: '三明市' },
      { value: '泉州市', label: '泉州市' },
      { value: '漳州市', label: '漳州市' },
      { value: '南平市', label: '南平市' },
      { value: '龙岩市', label: '龙岩市' },
      { value: '宁德市', label: '宁德市' }
    ]
  },
  {
    value: '安徽省',
    label: '安徽省',
    children: [
      { value: '合肥市', label: '合肥市' },
      { value: '芜湖市', label: '芜湖市' },
      { value: '蚌埠市', label: '蚌埠市' },
      { value: '淮南市', label: '淮南市' },
      { value: '马鞍山市', label: '马鞍山市' },
      { value: '淮北市', label: '淮北市' },
      { value: '铜陵市', label: '铜陵市' },
      { value: '安庆市', label: '安庆市' },
      { value: '黄山市', label: '黄山市' },
      { value: '滁州市', label: '滁州市' },
      { value: '阜阳市', label: '阜阳市' },
      { value: '宿州市', label: '宿州市' },
      { value: '六安市', label: '六安市' },
      { value: '亳州市', label: '亳州市' },
      { value: '池州市', label: '池州市' },
      { value: '宣城市', label: '宣城市' }
    ]
  },
  {
    value: '河北省',
    label: '河北省',
    children: [
      { value: '石家庄市', label: '石家庄市' },
      { value: '唐山市', label: '唐山市' },
      { value: '秦皇岛市', label: '秦皇岛市' },
      { value: '邯郸市', label: '邯郸市' },
      { value: '邢台市', label: '邢台市' },
      { value: '保定市', label: '保定市' },
      { value: '张家口市', label: '张家口市' },
      { value: '承德市', label: '承德市' },
      { value: '沧州市', label: '沧州市' },
      { value: '廊坊市', label: '廊坊市' },
      { value: '衡水市', label: '衡水市' }
    ]
  },
  {
    value: '辽宁省',
    label: '辽宁省',
    children: [
      { value: '沈阳市', label: '沈阳市' },
      { value: '大连市', label: '大连市' },
      { value: '鞍山市', label: '鞍山市' },
      { value: '抚顺市', label: '抚顺市' },
      { value: '本溪市', label: '本溪市' },
      { value: '丹东市', label: '丹东市' },
      { value: '锦州市', label: '锦州市' },
      { value: '营口市', label: '营口市' },
      { value: '阜新市', label: '阜新市' },
      { value: '辽阳市', label: '辽阳市' },
      { value: '盘锦市', label: '盘锦市' },
      { value: '铁岭市', label: '铁岭市' },
      { value: '朝阳市', label: '朝阳市' },
      { value: '葫芦岛市', label: '葫芦岛市' }
    ]
  },
  {
    value: '重庆市',
    label: '重庆市',
    children: [
      { value: '万州区', label: '万州区' },
      { value: '涪陵区', label: '涪陵区' },
      { value: '渝中区', label: '渝中区' },
      { value: '大渡口区', label: '大渡口区' },
      { value: '江北区', label: '江北区' },
      { value: '沙坪坝区', label: '沙坪坝区' },
      { value: '九龙坡区', label: '九龙坡区' },
      { value: '南岸区', label: '南岸区' },
      { value: '北碚区', label: '北碚区' },
      { value: '渝北区', label: '渝北区' },
      { value: '巴南区', label: '巴南区' },
      { value: '长寿区', label: '长寿区' },
      { value: '江津区', label: '江津区' },
      { value: '合川区', label: '合川区' },
      { value: '永川区', label: '永川区' },
      { value: '南川区', label: '南川区' }
    ]
  },
  {
    value: '天津市',
    label: '天津市',
    children: [
      { value: '和平区', label: '和平区' },
      { value: '河东区', label: '河东区' },
      { value: '河西区', label: '河西区' },
      { value: '南开区', label: '南开区' },
      { value: '河北区', label: '河北区' },
      { value: '红桥区', label: '红桥区' },
      { value: '东丽区', label: '东丽区' },
      { value: '西青区', label: '西青区' },
      { value: '津南区', label: '津南区' },
      { value: '北辰区', label: '北辰区' },
      { value: '武清区', label: '武清区' },
      { value: '宝坻区', label: '宝坻区' },
      { value: '滨海新区', label: '滨海新区' },
      { value: '宁河区', label: '宁河区' },
      { value: '静海区', label: '静海区' },
      { value: '蓟州区', label: '蓟州区' }
    ]
  }
]

// 获取所有城市列表（用于期望城市选择）
export const getAllCities = (): string[] => {
  const cities: string[] = []
  regionData.forEach(province => {
    if (province.children) {
      province.children.forEach(city => {
        cities.push(city.value)
      })
    }
  })
  return cities.sort()
}

// 根据城市名获取完整地址
export const getFullAddress = (selectedValues: string[]): string => {
  if (selectedValues.length === 0) return ''
  if (selectedValues.length === 1) return selectedValues[0] || ''
  if (selectedValues.length === 2) {
    const province = selectedValues[0] || ''
    const city = selectedValues[1] || ''
    // 如果是直辖市，直接返回市+区
    if (['北京市', '上海市', '天津市', '重庆市'].includes(province)) {
      return `${province}${city}`
    }
    return `${province}${city}`
  }
  return selectedValues.join('')
}
