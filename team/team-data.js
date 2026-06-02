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
        folder: 'team/jiang-yuhao'
    },
    {
        id: 'du-yunfan',
        name: '杜云帆',
        title: '联合创始人',
        avatarInitial: '杜',
        avatarGradient: 'grad-hero',
        shortBio: '武汉科技大学机器人专业学士，主攻强化学习与机器人智能决策方向。致力于将 DQN、PPO 等前沿算法与机器人硬件深度融合，推动机器人从"编程执行"迈向"自主学习"。',
        folder: 'team/du-yunfan'
    },
    {
        id: 'li-chengguo',
        name: '李程果 & CTO',
        title: '联合创始人',
        avatarInitial: '李',
        avatarGradient: 'grad-hero',
        shortBio: '武汉科技大学机械专业学士，具备从机械结构设计、机电一体化到嵌入式开发的机器人全栈能力。擅长将机械本体、控制系统与嵌入式软硬件打通，打造完整可靠的机器人系统。',
        folder: 'team/li-chengguo'
    },
    {
        id: 'wang-le',
        name: '王乐',
        title: '联合创始人',
        avatarInitial: '王',
        avatarGradient: 'grad-service',
        shortBio: '武汉科技大学机械工程学士。',
        photo: 'team/wang-le/wangle.jpg',
        folder: 'team/wang-le'
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
        id: 'shan-mingyu',
        name: '单鸣宇',
        title: '电子设计总监',
        avatarInitial: '单',
        avatarGradient: 'grad-service',
        shortBio: '武汉科技大学电子信息硕士。',
        folder: 'team/shan-mingyu'
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
        id: 'wu-yuanhui',
        name: '吴元辉',
        title: '机电设计工程师',
        avatarInitial: '吴',
        avatarGradient: 'grad-service',
        shortBio: '武汉科技大学机器人专业学士。',
        folder: 'team/wu-yuanhui'
    }
];
