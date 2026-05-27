/* ============================================
   团队成员数据 — 所有成员集中在此文件
   增减人员只需操作 team/ 文件夹：
   1. 在本文件数组中添加/删除条目
   2. 创建/删除对应文件夹（如 team/xxx/），内含 content.json
   无需修改 index.html，JS 会自动渲染
   ============================================ */

var teamData = [
    {
        id: 'jiang-yuhao',
        name: '蒋宇皓',
        title: '创始人',
        avatarInitial: '蒋',
        avatarGradient: 'grad-hero',
        shortBio: '武汉科技大学自动化学士，怀揣"让机器人走进千行百业"的愿景创立科科机器人，专注于智能机器人技术的产业化落地与团队建设。',
        photo: 'team/jiang-yuhao/蒋宇皓.jpg',
        folder: 'team/jiang-yuhao'
    },
    {
        id: 'li-sihan',
        name: '李思涵',
        title: '联合创始人 & CTO',
        avatarInitial: '李',
        avatarGradient: 'grad-industry',
        shortBio: '浙江大学计算机硕士，前百度深度学习研究院资深研究员。主导多款AI产品技术架构设计，在CV与NLP领域有深厚积累。',
        folder: 'team/li-sihan'
    },
    {
        id: 'pan-ye',
        name: '潘烨',
        title: '嵌入式开发总监',
        avatarInitial: '潘',
        avatarGradient: 'grad-service',
        shortBio: '武汉科技大学电子信息学士。',
        folder: 'team/pan-ye'
    },
    {
        id: 'wang-le',
        name: '王乐',
        title: '叼毛',
        avatarInitial: '王',
        avatarGradient: 'grad-service',
        shortBio: '武汉科技大学机械工程学士。',
        photo: 'team/wang-le/wangle.jpg',
        folder: 'team/wang-le'
    },
    {
        id: 'yao-xuan',
        name: '姚旋',
        title: '机械设计总监',
        avatarInitial: '姚',
        avatarGradient: 'grad-service',
        shortBio: '武汉科技大学机械工程学士。',
        folder: 'team/yao-xuan'
    },
    {
        id: 'chen-yutong',
        name: '陈雨桐',
        title: '产品设计总监',
        avatarInitial: '陈',
        avatarGradient: 'grad-hero',
        shortBio: '上海交通大学工业设计硕士，前小米生态链高级产品经理。擅长将前沿技术转化为极致用户体验，作品荣获iF设计奖。',
        folder: 'team/chen-yutong'
    }
];
