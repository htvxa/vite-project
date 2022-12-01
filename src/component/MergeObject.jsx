import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { dictionary, tabList, translate } from "./constants";
import { listSkillIdTq, listSkillIdVn, listSkillTrans } from "./dictionary";
import { capitalize } from "./GetAll";
import JsonPreview from "./JsonPreview";

const MergeObject = () => {
  const [fileContent, setFileContent] = useState("");
  const data1 = {
    0: "军略",
    1: "营",
    2: "梦魇",
    3: "忍",
    4: "星",
    5: "暴怒",
    6: "魅惑",
    7: "围",
    8: "奇兵",
    9: "正兵",
    10: "平定",
    11: "天任",
    12: "助战",
    13: "影",
    14: "潜梦",
    15: "巧",
    16: "诅咒",
    17: "兴",
    18: "星屑",
    19: "姻缘者",
    20: "威",
    21: "蝶舞",
    22: "符",
    23: "黑色牌",
    24: "牌",
    25: "礼",
    26: "幻身·右",
    27: "幻身·左",
    28: "幻身",
    29: "雷击",
    30: "鬼道",
    31: "功",
    32: "筑",
    33: "刺酋",
    34: "四象天阵",
    35: "滔乱",
    36: "灵偃",
    37: "魇",
    38: "替身",
    39: "摸牌数-2",
    40: "经天",
    41: "幻术",
    42: "巨噬",
    43: "出牌阶段限三次，你可以失去一点体力，视为使用任意一张能造成伤害的牌",
    44: "获得一个随机基础图腾",
    45: "获得任意一个图腾（若有4个图腾则改为替换一个图腾）",
    46: "狂风",
    47: "大雾",
    48: "连计",
    49: "矜功",
    50: "经",
    51: "惧",
    52: "铃",
    53: "诤",
    54: "渠",
    55: "讨灭",
    56: "檄",
    57: "武库",
    58: "喻",
    59: "辅弼",
    60: "御风飞行",
    61: "御风",
    62: "冀",
    63: "命运签",
    64: "使用【杀】/【闪】结算完成后",
    65: "谋立",
    66: "殉义",
    67: "固",
    68: "仁",
    69: "生",
    70: "遗珠",
    71: "姻",
    72: "明伐",
    73: "谦",
    74: "备",
    75: "权",
    76: "绝",
    77: "兵",
    78: "厉",
    79: "整肃",
    80: "奉",
    81: "释",
    82: "名",
    83: "六经",
    84: "策",
    85: "锦",
    86: "武",
    87: "文",
    88: "方",
    89: "裔",
    90: "荐言",
    91: "醇",
    92: "咆",
    93: "限两次",
    94: "司",
    95: "或",
    96: "并",
    97: "竭忠",
    98: "辎",
    99: "变",
    100: "勤王",
    101: "逆",
    102: "椎",
    103: "任",
    104: "橘",
    105: "飞军",
    106: "决堰",
    107: "怀柔",
    108: "荣",
    109: "清侧",
    110: "创",
    111: "缠怨",
    112: "暴戾",
    113: "关索",
    114: "舞",
    115: "你可以将一张基本牌当任意基本牌牌使用或打出",
    116: "抚蛮",
    117: "梅影",
    118: "锋",
    119: "饶舌",
    120: "鼓舌",
    121: "星舞",
    122: "星舞牌",
    123: "天香",
    124: "流离",
    125: "祈禳",
    126: "燃",
    127: "已受伤角色",
    128: "已受伤角色或其他吴势力角色",
    129: "咒",
    130: "省",
    131: "距离为1",
    132: "体力值等于你",
    133: "改写",
    134: "游龙",
    135: "乱",
    136: "丰",
    137: "歉",
    138: "诔",
    139: "赋",
    140: "颂",
    141: "旋",
    142: "锻造",
    143: "同协角色",
    144: "灵杉",
    145: "玉树",
    146: "掠命",
    147: "闭境",
    148: "信",
    149: "傀",
    150: "丹血",
    151: "珠",
    152: "表",
    153: "粮",
    154: "在自己的回合时每回合限两次",
    155: "协穆",
    156: "流",
    157: "镇南",
    158: "每回合每项限两次",
    159: "义子",
    160: "叛弑",
    161: "慈孝",
    162: "出牌阶段限两次",
    163: "裂",
    164: "抗歌",
    165: "重",
    166: "黠慧",
    167: "你的回合内",
    168: "一回合内",
    169: "若其手牌中没有【闪】，则你摸两张牌",
    170: "，然后你交给其等量的牌",
    171: "写满技能的天书",
    172: "隙",
    173: "徐氏",
    174: "伤害",
    175: "自己",
    176: "一名角色",
    177: "锦绘",
    178: "梳",
    179: "异",
    180: "疠",
    181: "陈见",
    182: "仁/义/礼/智/信",
    183: "席",
    184: "沙",
    185: "怨",
    186: "栗",
    187: "转",
    188: "钝",
    189: "陷阱",
    190: "护天",
    191: "马",
    192: "外使",
    193: "丹",
    194: "法宝",
    195: "毒",
    196: "♦数",
    197: "红色牌数",
    198: "示",
    199: "施法",
    200: "其须交给你一张牌",
    201: "你可对其造成1点伤害",
    202: "蕴",
    203: "酬",
    204: "书",
    205: "清弦残谱",
    206: "矫诏",
    207: "基本牌",
    208: "基本牌或普通锦囊牌",
    209: "选择距离最近的一名其他角色，该角色",
    210: "你",
    211: "出牌阶段限一次",
    212: "节",
    213: "司敌",
    214: "排异",
    215: "胆守",
    216: "武圣",
    217: "咆哮",
    218: "爵",
    219: "才媛",
    220: "弃置",
    221: "获得",
    222: "祸",
    223: "绥",
    224: "其本阶段内是否会使用与展示牌牌名相同的牌",
    225: "嫕",
  };
  const data2 = {
    0: "Quân lược",
    1: "Doanh",
    2: "Mộng yểm",
    3: "Nhẫn",
    4: "Tinh",
    5: "Bạo nộ",
    6: "Mị hoặc",
    7: "Vi",
    8: "Kỳ binh",
    9: "Chính binh",
    10: "Bình định",
    11: "Thiên nhậm",
    12: "Trợ chiến",
    13: "Ảnh",
    14: "Tiềm mộng",
    15: "Xảo",
    16: "Trớ chú",
    17: "Hưng",
    18: "Tinh tiết",
    19: "Nhân duyên giả",
    20: "Uy",
    21: "Điệp vũ",
    22: "Phù",
    23: "Hắc sắc bài",
    24: "Bài",
    25: "Lễ",
    26: "Huyễn thân · hữu",
    27: "Huyễn thân · tả",
    28: "Huyễn thân",
    29: "Lôi kích",
    30: "Quỷ đạo",
    31: "Công",
    32: "Trúc",
    33: "Thứ tù",
    34: "Tứ tượng thiên trận",
    35: "Thao loạn",
    36: "Linh yển",
    37: "Yểm",
    38: "Thế thân",
    39: "Mạc bài sổ -2",
    40: "Kinh thiên",
    41: "Huyễn thuật",
    42: "Cự phệ",
    43: "Ra bài giai đoạn hạn ba lần, ngươi có thể mất đi một chút thể lực, coi là sử dụng tùy ý một trương có thể tạo thành thương tổn bài",
    44: "Đạt được một cái tùy cơ cơ sở đồ đằng",
    45: "Đạt được tùy ý một cái đồ đằng ( nếu có 4 cái đồ đằng tắc sửa vì thay đổi một cái đồ đằng )",
    46: "Cuồng phong",
    47: "Đại vụ",
    48: "Liên kế",
    49: "Căng công",
    50: "Kinh",
    51: "Cụ",
    52: "Linh",
    53: "Tránh",
    54: "Cừ",
    55: "Thảo diệt",
    56: "Hịch",
    57: "Võ khố",
    58: "Dụ",
    59: "Phụ bật",
    60: "Ngự phong phi hành",
    61: "Ngự phong",
    62: "Ký",
    63: "Mệnh vận thiêm",
    64: "Sử dụng 【 Sát 】/【 Thiểm 】 kết toán hoàn thành sau",
    65: "Mưu lập",
    66: "Tuẫn nghĩa",
    67: "Cố",
    68: "Nhân",
    69: "Sinh",
    70: "Di châu",
    71: "Nhân",
    72: "Minh phạt",
    73: "Khiêm",
    74: "Bị",
    75: "Quyền",
    76: "Tuyệt",
    77: "Binh",
    78: "Lệ",
    79: "Chỉnh túc",
    80: "Phụng",
    81: "Thích",
    82: "Danh",
    83: "Lục kinh",
    84: "Sách",
    85: "Cẩm",
    86: "Võ",
    87: "Văn",
    88: "Phương",
    89: "Duệ",
    90: "Tiến ngôn",
    91: "Thuần",
    92: "Bào",
    93: "Hạn lưỡng thứ",
    94: "Tư",
    95: "Hoặc",
    96: "Tịnh",
    97: "Kiệt trung",
    98: "Truy",
    99: "Biến",
    100: "Cần vương",
    101: "Nghịch",
    102: "Chuy",
    103: "Nhậm",
    104: "Quất",
    105: "Phi quân",
    106: "Quyết yển",
    107: "Hoài nhu",
    108: "Vinh",
    109: "Thanh trắc",
    110: "Sang",
    111: "Triền oán",
    112: "Bạo lệ",
    113: "Quan tác",
    114: "Vũ",
    115: "Ngươi có thể đem một trương cơ bản bài đương tùy ý cơ bản bài bài sử dụng hoặc đánh ra",
    116: "Phủ man",
    117: "Mai ảnh",
    118: "Phong",
    119: "Nhiêu thiệt",
    120: "Cổ thiệt",
    121: "Tinh vũ",
    122: "Tinh vũ bài",
    123: "Thiên hương",
    124: "Lưu ly",
    125: "Kỳ nhương",
    126: "Nhiên",
    127: "Đã bị thương nhân vật",
    128: "Đã bị thương nhân vật hoặc mặt khác Ngô thế lực nhân vật",
    129: "Chú",
    130: "Tỉnh",
    131: "Khoảng cách vì 1",
    132: "Thể lực giá trị tương đương ngươi",
    133: "Cải tả",
    134: "Du long",
    135: "Loạn",
    136: "Phong",
    137: "Khiểm",
    138: "Lụy",
    139: "Phú",
    140: "Tụng",
    141: "Toàn",
    142: "Đoán tạo",
    143: "Đồng hiệp giác sắc",
    144: "Linh sam",
    145: "Ngọc thụ",
    146: "Lược mệnh",
    147: "Bế cảnh",
    148: "Tín",
    149: "Khôi",
    150: "Đan huyết",
    151: "Châu",
    152: "Biểu",
    153: "Lương",
    154: "Ở chính mình hiệp khi mỗi lần hợp hạn hai lần",
    155: "Hiệp mục",
    156: "Lưu",
    157: "Trấn nam",
    158: "Mỗi lần hợp mỗi hạng hạn hai lần",
    159: "Nghĩa tử",
    160: "Bạn thí",
    161: "Từ hiếu",
    162: "Ra bài giai đoạn hạn hai lần",
    163: "Liệt",
    164: "Kháng ca",
    165: "Trọng",
    166: "Hiệt tuệ",
    167: "Nhĩ đích hồi hợp nội",
    168: "Nhất hồi hợp nội",
    169: "Nếu này tay bài trung không có 【 lóe 】, tắc ngươi sờ hai trương bài",
    170: ", Sau đó ngươi giao cho này ngang nhau bài",
    171: "Tràn ngập kỹ năng thiên thư",
    172: "Khích",
    173: "Từ thị",
    174: "Thương hại",
    175: "Tự kỷ",
    176: "Nhất danh giác sắc",
    177: "Cẩm hội",
    178: "Sơ",
    179: "Dị",
    180: "Lệ",
    181: "Trần kiến",
    182: "Nhân / nghĩa / lễ / trí / tín",
    183: "Tịch",
    184: "Sa",
    185: "Oán",
    186: "Lật",
    187: "Chuyển",
    188: "Độn",
    189: "Hãm tịnh",
    190: "Hộ thiên",
    191: "Mã",
    192: "Ngoại sử",
    193: "Đan",
    194: "Pháp bảo",
    195: "Độc",
    196: "♦ sổ",
    197: "Hồng sắc bài sổ",
    198: "Kỳ",
    199: "Thi pháp",
    200: "Này cần giao cho ngươi một trương bài",
    201: "Ngươi nhưng đối này tạo thành 1 điểm thương tổn",
    202: "Uẩn",
    203: "Thù",
    204: "Thư",
    205: "Thanh huyền tàn phổ",
    206: "Kiểu chiếu",
    207: "Cơ bổn bài",
    208: "Cơ bản bài hoặc bình thường túi gấm bài",
    209: "Lựa chọn khoảng cách gần nhất một người mặt khác nhân vật, nên nhân vật",
    210: "Nhĩ",
    211: "Ra bài giai đoạn hạn một lần",
    212: "Tiết",
    213: "Tư địch",
    214: "Bài dị",
    215: "Đảm thủ",
    216: "Võ thánh",
    217: "Bào hao",
    218: "Tước",
    219: "Tài viện",
    220: "Khí trí",
    221: "Đạt được",
    222: "Họa",
    223: "Tuy",
    224: "Này bổn giai đoạn nội hay không sẽ sử dụng cùng triển lãm bài bài danh tướng cùng bài",
    225: "Ế",
  };

  const merge = (keyObj, valueObj) => {
    const list = {};
    Object.entries(keyObj).forEach(([key, value]) => {
      list[value] = capitalize(valueObj[key]);
    });
    return list;
  };
  const onMerge = () => {
    console.log(merge(data1, data2));
    const obj = merge(data1, data2);
    let newObj = {};
    const keyList = Object.entries(obj)
      .sort((a, b) => b[0].length - a[0].length)
      .forEach(([key, value]) => {
        newObj[key] = value;
      });
    console.log(keyList);
    console.log(newObj);
    // console.log(merge(listSkillIdTq, listSkillIdVn));
  };
  const onTranslate = () => {
    console.log(merge(data1, data2));
  };

  const showFile = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      var preview = document.getElementById("show-text");
      var file = document.querySelector("input[type=file]").files[0];
      var reader = new FileReader();

      var textFile = /text.*/;

      if (file.type.match(textFile)) {
        reader.onload = function (event) {
          setFileContent(event.target.result);
        };
      } else {
        preview.innerHTML =
          "<span class='error'>It doesn't seem to be a text file!</span>";
      }
      reader.readAsText(file);
    } else {
      alert("Your browser is too old to support HTML5 File API");
    }
  };

  const onReplace = () => {
    let newContent = fileContent;
    // Object.entries(dictionary)
    //   .sort((a, b) => b[0].length - a[0].length)
    //   .forEach((item) => {
    //     newContent = newContent.replaceAll(item[0], item[1]);
    //   });
    Object.entries(listSkillTrans)
      .sort((a, b) => b[0].length - a[0].length)
      .forEach((item) => {
        newContent = newContent.replaceAll(item[0], item[1]);
      });
    console.log(newContent);
  };
  useEffect(() => {
    let trans = {};
    tabList.forEach((item) => (trans = { ...trans, ...translate[item] }));
    Object.keys(trans).forEach((item) => {
      if (item.indexOf("_info") > 0 || trans[item].length > 11) {
        delete trans[item];
      }
    });
    console.log(trans);
  }, []);

  return (
    <>
      <Button className="" onClick={onMerge}>
        Merge
      </Button>
      <input type="file" onChange={showFile} />
      <Button className="" onClick={onReplace}>
        <span>Replace</span>
      </Button>
      <Button className="" onClick={onTranslate}>
        Translate
      </Button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0 20px",
          textAlign: "left",
        }}
      >
        <div style={{ width: "100%" }}>
          <JsonPreview src={data1} />
        </div>
        <div style={{ width: "100%" }}>
          <JsonPreview src={data2} />
        </div>
      </div>{" "}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0 20px",
          textAlign: "left",
        }}
      >
        <div style={{ width: "100%" }}>
          <JsonPreview src={listSkillIdTq} />
        </div>
        <div style={{ width: "100%" }}>
          <JsonPreview src={listSkillIdVn} />
        </div>
      </div>
    </>
  );
};

export default MergeObject;
