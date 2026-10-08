import { Gender, GroupType, IdolStatus, MembershipStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const imageUrls = {
  groupProfile:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  groupBanner:
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1800&q=80",
  idolProfile:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
};

const agencies = [
  {
    slug: "sm-entertainment",
    name: "SM Entertainment",
    koreanName: "SM엔터테인먼트",
    websiteUrl: "https://www.smentertainment.com/",
  },
  {
    slug: "jyp-entertainment",
    name: "JYP Entertainment",
    koreanName: "JYP엔터테인먼트",
    websiteUrl: "https://www.jype.com/",
  },
  {
    slug: "starship-entertainment",
    name: "Starship Entertainment",
    koreanName: "스타쉽엔터테인먼트",
    websiteUrl: "https://www.starship-ent.com/",
  },
  {
    slug: "belift-lab",
    name: "BELIFT LAB",
    koreanName: "빌리프랩",
    websiteUrl: "https://beliftlab.com/",
  },
  {
    slug: "tamago-production",
    name: "Tamago Production",
    koreanName: "타마고 프로덕션",
    websiteUrl: "https://www.youtube.com/@QWER_Band_official",
  },
] as const;

type MemberSeed = {
  stageName: string;
  legalName: string;
  koreanName: string;
  slug: string;
  birthDate: string;
  nationality: string;
  role: string;
  isLeader?: boolean;
};

type GroupSeed = {
  name: string;
  koreanName: string;
  slug: string;
  agencySlug: (typeof agencies)[number]["slug"];
  generation: number;
  debutDate: string;
  members: MemberSeed[];
};

const groups: GroupSeed[] = [
  {
    name: "Red Velvet",
    koreanName: "레드벨벳",
    slug: "red-velvet",
    agencySlug: "sm-entertainment",
    generation: 3,
    debutDate: "2014-08-01",
    members: [
      {
        stageName: "Irene",
        legalName: "Bae Joo-hyun",
        koreanName: "배주현",
        slug: "irene",
        birthDate: "1991-03-29",
        nationality: "Korea Selatan",
        role: "Leader, Main Rapper, Lead Dancer, Sub Vocalist",
        isLeader: true,
      },
      {
        stageName: "Seulgi",
        legalName: "Kang Seul-gi",
        koreanName: "강슬기",
        slug: "seulgi",
        birthDate: "1994-02-10",
        nationality: "Korea Selatan",
        role: "Main Dancer, Lead Vocalist",
      },
      {
        stageName: "Wendy",
        legalName: "Son Seung-wan",
        koreanName: "손승완",
        slug: "wendy",
        birthDate: "1994-02-21",
        nationality: "Korea Selatan",
        role: "Main Vocalist",
      },
      {
        stageName: "Joy",
        legalName: "Park Soo-young",
        koreanName: "박수영",
        slug: "joy",
        birthDate: "1996-09-03",
        nationality: "Korea Selatan",
        role: "Lead Rapper, Sub Vocalist",
      },
      {
        stageName: "Yeri",
        legalName: "Kim Ye-rim",
        koreanName: "김예림",
        slug: "yeri",
        birthDate: "1999-03-05",
        nationality: "Korea Selatan",
        role: "Sub Vocalist, Sub Rapper, Maknae",
      },
    ],
  },
  {
    name: "TWICE",
    koreanName: "트와이스",
    slug: "twice",
    agencySlug: "jyp-entertainment",
    generation: 3,
    debutDate: "2015-10-20",
    members: [
      {
        stageName: "Nayeon",
        legalName: "Im Na-yeon",
        koreanName: "임나연",
        slug: "nayeon",
        birthDate: "1995-09-22",
        nationality: "Korea Selatan",
        role: "Lead Vocalist, Lead Dancer, Center",
      },
      {
        stageName: "Jeongyeon",
        legalName: "Yoo Jeong-yeon",
        koreanName: "유정연",
        slug: "jeongyeon",
        birthDate: "1996-11-01",
        nationality: "Korea Selatan",
        role: "Lead Vocalist",
      },
      {
        stageName: "Momo",
        legalName: "Hirai Momo",
        koreanName: "平井もも (히라이 모모)",
        slug: "momo",
        birthDate: "1996-11-09",
        nationality: "Jepang",
        role: "Main Dancer, Sub Vocalist, Sub Rapper",
      },
      {
        stageName: "Sana",
        legalName: "Minatozaki Sana",
        koreanName: "湊﨑紗夏 (미나토자키 사나)",
        slug: "sana",
        birthDate: "1996-12-29",
        nationality: "Jepang",
        role: "Sub Vocalist",
      },
      {
        stageName: "Jihyo",
        legalName: "Park Ji-hyo",
        koreanName: "박지효",
        slug: "jihyo",
        birthDate: "1997-02-01",
        nationality: "Korea Selatan",
        role: "Leader, Main Vocalist",
        isLeader: true,
      },
      {
        stageName: "Mina",
        legalName: "Myoi Mina",
        koreanName: "名井南 (묘이 미나)",
        slug: "mina",
        birthDate: "1997-03-24",
        nationality: "Jepang-Amerika",
        role: "Main Dancer, Sub Vocalist",
      },
      {
        stageName: "Dahyun",
        legalName: "Kim Da-hyun",
        koreanName: "김다현",
        slug: "dahyun",
        birthDate: "1998-05-28",
        nationality: "Korea Selatan",
        role: "Lead Rapper, Sub Vocalist",
      },
      {
        stageName: "Chaeyoung",
        legalName: "Son Chae-young",
        koreanName: "손채영",
        slug: "chaeyoung",
        birthDate: "1999-04-23",
        nationality: "Korea Selatan",
        role: "Main Rapper, Sub Vocalist",
      },
      {
        stageName: "Tzuyu",
        legalName: "Chou Tzu-yu",
        koreanName: "周子瑜 (저우쯔위)",
        slug: "tzuyu",
        birthDate: "1999-06-14",
        nationality: "Taiwan",
        role: "Lead Dancer, Sub Vocalist, Visual, Maknae",
      },
    ],
  },
  {
    name: "ITZY",
    koreanName: "있지",
    slug: "itzy",
    agencySlug: "jyp-entertainment",
    generation: 4,
    debutDate: "2019-02-12",
    members: [
      {
        stageName: "Yeji",
        legalName: "Hwang Ye-ji",
        koreanName: "황예지",
        slug: "yeji",
        birthDate: "2000-05-26",
        nationality: "Korea Selatan",
        role: "Leader, Main Dancer, Lead Vocalist, Sub Rapper",
        isLeader: true,
      },
      {
        stageName: "Lia",
        legalName: "Choi Ji-su",
        koreanName: "최지수",
        slug: "lia",
        birthDate: "2000-07-21",
        nationality: "Korea Selatan-Kanada",
        role: "Main Vocalist",
      },
      {
        stageName: "Ryujin",
        legalName: "Shin Ryu-jin",
        koreanName: "신류진",
        slug: "ryujin",
        birthDate: "2001-04-17",
        nationality: "Korea Selatan",
        role: "Main Rapper, Lead Dancer, Center",
      },
      {
        stageName: "Chaeryeong",
        legalName: "Lee Chae-ryeong",
        koreanName: "이채령",
        slug: "chaeryeong",
        birthDate: "2001-06-05",
        nationality: "Korea Selatan",
        role: "Main Dancer, Sub Vocalist",
      },
      {
        stageName: "Yuna",
        legalName: "Shin Yu-na",
        koreanName: "신유나",
        slug: "yuna",
        birthDate: "2003-12-09",
        nationality: "Korea Selatan",
        role: "Lead Dancer, Lead Rapper, Visual, Maknae",
      },
    ],
  },
  {
    name: "IVE",
    koreanName: "아이브",
    slug: "ive",
    agencySlug: "starship-entertainment",
    generation: 4,
    debutDate: "2021-12-01",
    members: [
      {
        stageName: "Gaeul",
        legalName: "Kim Ga-eul",
        koreanName: "김가을",
        slug: "gaeul",
        birthDate: "2002-09-24",
        nationality: "Korea Selatan",
        role: "Main Rapper, Lead Dancer",
      },
      {
        stageName: "Yujin",
        legalName: "An Yu-jin",
        koreanName: "안유진",
        slug: "yujin",
        birthDate: "2003-09-01",
        nationality: "Korea Selatan",
        role: "Leader, Lead Vocalist",
        isLeader: true,
      },
      {
        stageName: "Rei",
        legalName: "Naoi Rei",
        koreanName: "直井怜 (나오이 레이)",
        slug: "rei",
        birthDate: "2004-02-03",
        nationality: "Jepang",
        role: "Main Rapper, Sub Vocalist",
      },
      {
        stageName: "Wonyoung",
        legalName: "Jang Won-young",
        koreanName: "장원영",
        slug: "wonyoung",
        birthDate: "2004-08-31",
        nationality: "Korea Selatan",
        role: "Vocalist, Visual, Center",
      },
      {
        stageName: "Liz",
        legalName: "Kim Ji-won",
        koreanName: "김지원",
        slug: "liz",
        birthDate: "2004-11-21",
        nationality: "Korea Selatan",
        role: "Main Vocalist",
      },
      {
        stageName: "Leeseo",
        legalName: "Lee Hyun-seo",
        koreanName: "이현서",
        slug: "leeseo",
        birthDate: "2007-02-21",
        nationality: "Korea Selatan",
        role: "Vocalist, Maknae",
      },
    ],
  },
  {
    name: "NMIXX",
    koreanName: "엔믹스",
    slug: "nmixx",
    agencySlug: "jyp-entertainment",
    generation: 4,
    debutDate: "2022-02-22",
    members: [
      {
        stageName: "Lily",
        legalName: "Lily Jin Morrow",
        koreanName: "릴리 진 머로우",
        slug: "lily-nmixx",
        birthDate: "2002-10-17",
        nationality: "Korea Selatan-Australia",
        role: "Main Vocalist",
      },
      {
        stageName: "Haewon",
        legalName: "Oh Hae-won",
        koreanName: "오해원",
        slug: "haewon",
        birthDate: "2003-02-25",
        nationality: "Korea Selatan",
        role: "Leader, Lead Vocalist",
        isLeader: true,
      },
      {
        stageName: "Sullyoon",
        legalName: "Seol Yoon-a",
        koreanName: "설윤아",
        slug: "sullyoon",
        birthDate: "2004-01-26",
        nationality: "Korea Selatan",
        role: "Lead Vocalist, Visual",
      },
      {
        stageName: "Bae",
        legalName: "Bae Jin-sol",
        koreanName: "배진솔",
        slug: "bae",
        birthDate: "2004-12-28",
        nationality: "Korea Selatan",
        role: "Vocalist, Dancer",
      },
      {
        stageName: "Jiwoo",
        legalName: "Kim Ji-woo",
        koreanName: "김지우",
        slug: "jiwoo-nmixx",
        birthDate: "2005-04-13",
        nationality: "Korea Selatan",
        role: "Main Rapper, Vocalist, Dancer",
      },
      {
        stageName: "Kyujin",
        legalName: "Jang Kyu-jin",
        koreanName: "장규진",
        slug: "kyujin",
        birthDate: "2006-05-26",
        nationality: "Korea Selatan",
        role: "Dancer, Rapper, Vocalist, Maknae",
      },
    ],
  },
  {
    name: "ILLIT",
    koreanName: "아일릿",
    slug: "illit",
    agencySlug: "belift-lab",
    generation: 5,
    debutDate: "2024-03-25",
    members: [
      {
        stageName: "Yunah",
        legalName: "Noh Yun-ah",
        koreanName: "노윤아",
        slug: "yunah",
        birthDate: "2004-01-15",
        nationality: "Korea Selatan",
        role: "Leader",
        isLeader: true,
      },
      {
        stageName: "Minju",
        legalName: "Park Min-ju",
        koreanName: "박민주",
        slug: "minju-illit",
        birthDate: "2004-05-11",
        nationality: "Korea Selatan",
        role: "Vocalist",
      },
      {
        stageName: "Moka",
        legalName: "Sakai Moka",
        koreanName: "酒井美空 (사카이 모카)",
        slug: "moka",
        birthDate: "2004-10-08",
        nationality: "Jepang",
        role: "Dancer, Vocalist",
      },
      {
        stageName: "Wonhee",
        legalName: "Lee Won-hee",
        koreanName: "이원희",
        slug: "wonhee",
        birthDate: "2007-06-26",
        nationality: "Korea Selatan",
        role: "Vocalist",
      },
      {
        stageName: "Iroha",
        legalName: "Hokazono Iroha",
        koreanName: "外園彩羽 (호카조노 이로하)",
        slug: "iroha",
        birthDate: "2008-02-04",
        nationality: "Jepang",
        role: "Dancer, Maknae",
      },
    ],
  },
  {
    name: "QWER",
    koreanName: "큐더블유이알",
    slug: "qwer",
    agencySlug: "tamago-production",
    generation: 5,
    debutDate: "2023-10-18",
    members: [
      {
        stageName: "Chodan",
        legalName: "Hong Ji-hye",
        koreanName: "홍지혜",
        slug: "chodan",
        birthDate: "1998-11-01",
        nationality: "Korea Selatan",
        role: "Leader, Drummer",
        isLeader: true,
      },
      {
        stageName: "Magenta",
        legalName: "Lee Ah-hee",
        koreanName: "이아희",
        slug: "magenta-qwer",
        birthDate: "1997-06-02",
        nationality: "Korea Selatan",
        role: "Bassist",
      },
      {
        stageName: "Hina",
        legalName: "Jang Na-hee",
        koreanName: "장나희",
        slug: "hina-qwer",
        birthDate: "2001-01-30",
        nationality: "Korea Selatan",
        role: "Guitarist, Keyboardist",
      },
      {
        stageName: "Siyeon",
        legalName: "Lee Si-yeon",
        koreanName: "이시연",
        slug: "siyeon-qwer",
        birthDate: "2000-05-16",
        nationality: "Korea Selatan",
        role: "Main Vocalist, Guitarist",
      },
    ],
  },
  {
    name: "Hearts2Hearts",
    koreanName: "하츠투하츠",
    slug: "hearts2hearts",
    agencySlug: "sm-entertainment",
    generation: 5,
    debutDate: "2025-02-24",
    members: [
      {
        stageName: "Carmen",
        legalName: "Nyoman Ayu Carmen",
        koreanName: "카르멘",
        slug: "carmen-hearts2hearts",
        birthDate: "2006-03-28",
        nationality: "Indonesia",
        role: "Vocalist",
      },
      {
        stageName: "Jiwoo",
        legalName: "Choi Ji-woo",
        koreanName: "최지우",
        slug: "jiwoo-hearts2hearts",
        birthDate: "2006-09-07",
        nationality: "Korea Selatan",
        role: "Leader, Vocalist",
        isLeader: true,
      },
      {
        stageName: "Yuha",
        legalName: "Yu Ha-ram",
        koreanName: "유하람",
        slug: "yuha",
        birthDate: "2007-04-12",
        nationality: "Korea Selatan",
        role: "Vocalist",
      },
      {
        stageName: "Stella",
        legalName: "Kim Da-hyun",
        koreanName: "김다현",
        slug: "stella-hearts2hearts",
        birthDate: "2007-06-18",
        nationality: "Korea Selatan-Kanada",
        role: "Vocalist",
      },
      {
        stageName: "Juun",
        legalName: "Kim Ju-eun",
        koreanName: "김주은",
        slug: "juun",
        birthDate: "2008-12-03",
        nationality: "Korea Selatan",
        role: "Vocalist",
      },
      {
        stageName: "A-na",
        legalName: "Noh Yu-na",
        koreanName: "노유나",
        slug: "a-na",
        birthDate: "2008-12-20",
        nationality: "Korea Selatan",
        role: "Vocalist",
      },
      {
        stageName: "Ian",
        legalName: "Jeong Yi-an",
        koreanName: "정이안",
        slug: "ian-hearts2hearts",
        birthDate: "2009-10-09",
        nationality: "Korea Selatan",
        role: "Vocalist",
      },
      {
        stageName: "Ye-on",
        legalName: "Kim Na-yeon",
        koreanName: "김나연",
        slug: "ye-on",
        birthDate: "2010-04-19",
        nationality: "Korea Selatan",
        role: "Vocalist, Maknae",
      },
    ],
  },
];

const toDate = (date: string) => new Date(`${date}T00:00:00.000Z`);

async function main() {
  const agencyIds = new Map<string, string>();

  for (const agencyData of agencies) {
    const agency = await prisma.agency.upsert({
      where: { slug: agencyData.slug },
      update: {
        name: agencyData.name,
        koreanName: agencyData.koreanName,
        websiteUrl: agencyData.websiteUrl,
      },
      create: agencyData,
    });
    agencyIds.set(agencyData.slug, agency.id);
  }

  for (const groupData of groups) {
    const agencyId = agencyIds.get(groupData.agencySlug);
    if (!agencyId) {
      throw new Error(`Agency not seeded: ${groupData.agencySlug}`);
    }

    const group = await prisma.group.upsert({
      where: { slug: groupData.slug },
      update: {
        name: groupData.name,
        koreanName: groupData.koreanName,
        type: GroupType.MAIN_GROUP,
        generation: groupData.generation,
        debutDate: toDate(groupData.debutDate),
        isActive: true,
        agencyId,
        profileImageUrl: imageUrls.groupProfile,
        bannerImageUrl: imageUrls.groupBanner,
      },
      create: {
        name: groupData.name,
        koreanName: groupData.koreanName,
        slug: groupData.slug,
        type: GroupType.MAIN_GROUP,
        generation: groupData.generation,
        debutDate: toDate(groupData.debutDate),
        isActive: true,
        agencyId,
        profileImageUrl: imageUrls.groupProfile,
        bannerImageUrl: imageUrls.groupBanner,
      },
    });

    for (const member of groupData.members) {
      const idol = await prisma.idol.upsert({
        where: { slug: member.slug },
        update: {
          stageName: member.stageName,
          legalName: member.legalName,
          koreanName: member.koreanName,
          gender: Gender.FEMALE,
          birthDate: toDate(member.birthDate),
          status: IdolStatus.ACTIVE,
          debutDate: toDate(groupData.debutDate),
          agencyId,
          profileImageUrl: imageUrls.idolProfile,
          nationality: member.nationality,
          generation: groupData.generation,
        },
        create: {
          stageName: member.stageName,
          legalName: member.legalName,
          koreanName: member.koreanName,
          slug: member.slug,
          gender: Gender.FEMALE,
          birthDate: toDate(member.birthDate),
          status: IdolStatus.ACTIVE,
          debutDate: toDate(groupData.debutDate),
          agencyId,
          profileImageUrl: imageUrls.idolProfile,
          nationality: member.nationality,
          generation: groupData.generation,
        },
      });

      await prisma.idolGroupMembership.upsert({
        where: { idolId_groupId: { idolId: idol.id, groupId: group.id } },
        update: {
          position: member.role,
          isLeader: member.isLeader ?? false,
          status: MembershipStatus.ACTIVE,
        },
        create: {
          idolId: idol.id,
          groupId: group.id,
          position: member.role,
          isLeader: member.isLeader ?? false,
          status: MembershipStatus.ACTIVE,
        },
      });
    }
  }

  console.log(
    `KPedia seed completed: ${groups.length} groups and ${groups.reduce((total, group) => total + group.members.length, 0)} members.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("KPedia seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
