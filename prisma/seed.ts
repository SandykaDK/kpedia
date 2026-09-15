import { randomBytes, scryptSync } from "node:crypto";
import {
  CreditRole,
  Gender,
  GroupType,
  IdolStatus,
  MembershipStatus,
  PrismaClient,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "AdminKpedia123!";
  const userPassword = process.env.SEED_USER_PASSWORD ?? "UserKpedia123!";

  await prisma.$transaction(async (tx) => {
    await tx.mediaEmbed.deleteMany();
    await tx.timelineEvent.deleteMany();
    await tx.credit.deleteMany();
    await tx.song.deleteMany();
    await tx.album.deleteMany();
    await tx.idolGroupMembership.deleteMany();
    await tx.idol.deleteMany();
    await tx.group.deleteMany();
    await tx.agency.deleteMany();
    await tx.user.deleteMany({
      where: { email: { in: ["admin@kpedia.local", "user@kpedia.local"] } },
    });

    await tx.user.createMany({
      data: [
        {
          name: "KPedia Admin",
          email: "admin@kpedia.local",
          passwordHash: hashPassword(adminPassword),
          role: UserRole.ADMIN,
        },
        {
          name: "Regular User",
          email: "user@kpedia.local",
          passwordHash: hashPassword(userPassword),
          role: UserRole.USER,
        },
      ],
    });

    const agency = await tx.agency.create({
      data: {
        slug: "sm-entertainment",
        name: "SM Entertainment",
        koreanName: "SM엔터테인먼트",
        websiteUrl: "https://www.smentertainment.com",
      },
    });

    const group = await tx.group.create({
      data: {
        slug: "red-velvet",
        name: "Red Velvet",
        koreanName: "레드벨벳",
        type: GroupType.MAIN_GROUP,
        generation: 3,
        debutDate: new Date("2014-08-01T00:00:00.000Z"),
        agencyId: agency.id,
      },
    });

    const seulgi = await tx.idol.create({
      data: {
        slug: "seulgi",
        stageName: "Seulgi",
        legalName: "Kang Seul-gi",
        koreanName: "강슬기",
        gender: Gender.FEMALE,
        birthDate: new Date("1994-02-10T00:00:00.000Z"),
        debutDate: new Date("2014-08-01T00:00:00.000Z"),
        status: IdolStatus.ACTIVE,
        agencyId: agency.id,
        profileImageUrl: null,
        biography: "Seulgi adalah penyanyi dan performer Korea Selatan yang dikenal sebagai anggota Red Velvet.",
        birthPlace: "Ansan, Gyeonggi-do, Korea Selatan",
        nationality: "Korea Selatan",
        generation: 3,
      },
    });

    const wendy = await tx.idol.create({
      data: {
        slug: "wendy",
        stageName: "Wendy",
        legalName: "Son Seung-wan",
        koreanName: "손승완",
        gender: Gender.FEMALE,
        birthDate: new Date("1994-02-21T00:00:00.000Z"),
        debutDate: new Date("2014-08-01T00:00:00.000Z"),
        status: IdolStatus.ACTIVE,
        agencyId: agency.id,
        profileImageUrl: null,
        biography: "Wendy adalah penyanyi Korea Selatan dan anggota Red Velvet dengan karakter vokal yang kuat.",
        birthPlace: "Seongbuk-dong, Seoul, Korea Selatan",
        nationality: "Korea Selatan",
        generation: 3,
      },
    });

    await tx.idolGroupMembership.createMany({
      data: [
        {
          idolId: seulgi.id,
          groupId: group.id,
          position: "Main Dancer, Lead Vocalist",
          status: MembershipStatus.ACTIVE,
        },
        {
          idolId: wendy.id,
          groupId: group.id,
          position: "Main Vocalist",
          status: MembershipStatus.ACTIVE,
        },
      ],
    });

    const album = await tx.album.create({
      data: {
        slug: "the-reve-festival-2022-feel-my-rhythm",
        title: "The ReVe Festival 2022 - Feel My Rhythm",
        type: "MINI_ALBUM",
        releaseDate: new Date("2022-03-21T00:00:00.000Z"),
        groupId: group.id,
      },
    });

    const feelMyRhythm = await tx.song.create({
      data: {
        albumId: album.id,
        title: "Feel My Rhythm",
        trackNumber: 1,
        isTitleTrack: true,
      },
    });

    const sunnySideUp = await tx.song.create({
      data: {
        albumId: album.id,
        title: "Rainbow Halo",
        trackNumber: 2,
      },
    });

    await tx.timelineEvent.create({
      data: {
        entityType: "GROUP",
        entityId: group.id,
        category: "COMEBACK",
        title: "Feel My Rhythm comeback",
        description: "Red Velvet merilis MV Feel My Rhythm sebagai title track dari The ReVe Festival 2022.",
        eventDate: new Date("2022-03-21T00:00:00.000Z"),
        sourceUrl: "https://youtu.be/R9At2ICm4LQ?si=Gi7GciMk7rnqWRjD",
      },
    });

    await tx.mediaEmbed.create({
      data: {
        entityType: "GROUP",
        entityId: group.id,
        provider: "YOUTUBE",
        externalId: "R9At2ICm4LQ",
        url: "https://www.youtube.com/embed/R9At2ICm4LQ",
        title: "Red Velvet - Feel My Rhythm MV",
        thumbnailUrl: "https://img.youtube.com/vi/R9At2ICm4LQ/hqdefault.jpg",
      },
    });

    await tx.credit.createMany({
      data: [
        { songId: feelMyRhythm.id, idolId: seulgi.id, role: CreditRole.VOCAL },
        { songId: feelMyRhythm.id, idolId: wendy.id, role: CreditRole.VOCAL },
        { songId: sunnySideUp.id, idolId: seulgi.id, role: CreditRole.VOCAL },
        { songId: sunnySideUp.id, idolId: wendy.id, role: CreditRole.VOCAL },
      ],
    });
  });

  console.log("KPedia seed completed successfully.");
  console.log("Admin: admin@kpedia.local");
  console.log("User: user@kpedia.local");
  console.log("Passwords are controlled by SEED_ADMIN_PASSWORD and SEED_USER_PASSWORD.");
}

main()
  .catch((error: unknown) => {
    console.error("KPedia seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
