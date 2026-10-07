import type { CSSProperties } from "react";

import styles from "../client-dossier.module.css";

interface ClientAvatarProps {
  seed: string;
  stats?: readonly string[];
  presentation: "feminine" | "masculine";
}

function hashSeed(seed: string): number {
  let hash = 2_166_136_261;

  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }

  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x7feb352d);
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x846ca68b);

  return (hash ^ (hash >>> 16)) >>> 0;
}

function traitIndex(seed: string, trait: string, optionCount: number): number {
  return hashSeed(`${seed}:${trait}`) % optionCount;
}

type AvatarStyle = CSSProperties & {
  "--avatar-skin": string;
  "--avatar-hair": string;
  "--avatar-shirt": string;
  "--avatar-jacket": string;
  "--avatar-backdrop": string;
};

const SKIN_TONES = [
  "#f3c9a7",
  "#dda47c",
  "#bf7d59",
  "#8f563c",
  "#6f432f",
] as const;

const HAIR_TONES = ["#11131a", "#51352f", "#1ed2f4", "#713e2f"] as const;
const SENIOR_HAIR_TONES = ["#777b85", "#aaa9a3", "#d6d2c8"] as const;
const SHIRT_TONES = ["#fff5e8", "#e9ecff", "#f8dc03"] as const;
const JACKET_TONES = ["#1ed2f4", "#11131a", "#f8dc03"] as const;
const BACKDROP_TONES = ["#fff5e8", "#e9ecff", "#ffffff"] as const;

function getAge(stats: readonly string[] | undefined): number | null {
  const ageStat = stats?.find((stat) => /^age\s*:?\s*\d+/i.test(stat.trim()));
  const age = ageStat?.match(/\d+/)?.[0];

  return age ? Number.parseInt(age, 10) : null;
}

export function ClientAvatar({ seed, stats, presentation }: ClientAvatarProps) {
  const age = getAge(stats);
  const isSenior = age !== null && age >= 65;
  const isMature = age !== null && age >= 50;
  const faceVariant = traitIndex(seed, "face", 3);
  const baseHairVariant = traitIndex(seed, "hair", 3);
  const hairVariant =
    presentation === "feminine"
      ? isSenior
        ? [7, 8][baseHairVariant % 2]
        : [6, 7, 8][baseHairVariant]
      : isSenior
        ? [3, 5][baseHairVariant % 2]
        : [0, 3, 4, 5][traitIndex(seed, "masculine-hair", 4)];
  const hasGlasses = traitIndex(seed, "glasses", 4) === 0;
  const hasBeard =
    presentation === "masculine" && traitIndex(seed, "beard", 5) === 0;
  const expressionVariant = traitIndex(seed, "expression", 3);
  const attireVariant =
    presentation === "feminine"
      ? [1, 2][traitIndex(seed, "feminine-attire", 2)]
      : traitIndex(seed, "attire", 3);
  const hairTone = isSenior
    ? SENIOR_HAIR_TONES[traitIndex(seed, "senior-hair-tone", SENIOR_HAIR_TONES.length)]
    : HAIR_TONES[traitIndex(seed, "hair-tone", HAIR_TONES.length)];
  const avatarStyle = {
    "--avatar-skin": SKIN_TONES[traitIndex(seed, "skin", SKIN_TONES.length)],
    "--avatar-hair": hairTone,
    "--avatar-shirt": SHIRT_TONES[traitIndex(seed, "shirt", SHIRT_TONES.length)],
    "--avatar-jacket": JACKET_TONES[traitIndex(seed, "jacket", JACKET_TONES.length)],
    "--avatar-backdrop": BACKDROP_TONES[traitIndex(seed, "backdrop", BACKDROP_TONES.length)],
  } as AvatarStyle;

  return (
    <span
      className={styles.avatar}
      aria-hidden="true"
      style={avatarStyle}
    >
      <svg viewBox="0 0 160 180" focusable="false">
        <rect width="160" height="180" rx="28" className={styles.avatarBackdrop} />
        <circle cx="132" cy="35" r="42" className={styles.avatarAccentCircle} />
        <path d="M-5 142 73 75l92 96v14H-5Z" className={styles.avatarAccentBlock} />

        <path d="M16 180c4-36 26-55 64-55s60 19 64 55Z" className={styles.avatarJacket} />
        <path d="m53 133 27 23 27-23 11 47H42Z" className={styles.avatarShirt} />
        <path d="M68 114h24v29H68Z" className={styles.avatarSkin} />
        <path d="m54 132 15-6 11 30-24-15M106 132l-15-6-11 30 24-15" className={styles.avatarLapels} />

        <ellipse cx="45" cy="79" rx="9" ry="13" className={styles.avatarSkin} />
        <ellipse cx="115" cy="79" rx="9" ry="13" className={styles.avatarSkin} />
        {faceVariant === 0 ? (
          <path
            d="M49 48c7-14 19-21 31-21s24 7 31 21l-4 47c-7 20-17 30-27 30S60 115 53 95Z"
            className={styles.avatarSkin}
          />
        ) : null}
        {faceVariant === 1 ? (
          <path
            d="M45 52c5-17 18-25 35-25s30 8 35 25l-5 43c-5 19-16 30-30 30S55 114 50 95Z"
            className={styles.avatarSkin}
          />
        ) : null}
        {faceVariant === 2 ? (
          <path
            d="M48 47c8-13 19-20 32-20s24 7 32 20l-3 49-17 25-12 5-12-5-17-25Z"
            className={styles.avatarSkin}
          />
        ) : null}

        {hairVariant === 0 ? (
          <path
            d="M47 61c-2-24 11-39 34-39 17 0 29 8 35 24-12-5-23-4-34 3-11-3-23 1-35 12Z"
            className={styles.avatarHair}
          />
        ) : null}
        {hairVariant === 1 ? (
          <path
            d="M44 65c-4-25 10-44 36-44 25 0 39 18 36 44-8-4-13-12-15-23-13 12-31 18-57 23Z"
            className={styles.avatarHair}
          />
        ) : null}
        {hairVariant === 2 ? (
          <>
            <path
              d="M43 69c-3-30 10-48 37-48 28 0 41 19 37 49l-11-9-5-20c-15 12-32 17-52 16Z"
              className={styles.avatarHair}
            />
            <path d="M45 62c-7 12-6 30 3 43l8-17-2-28Z" className={styles.avatarHair} />
            <path d="M115 62c7 12 6 30-3 43l-8-17 2-28Z" className={styles.avatarHair} />
          </>
        ) : null}
        {hairVariant === 3 ? (
          <>
            <path
              d="M46 59c1-22 14-37 34-37 18 0 31 11 36 31-14-9-29-11-45-4-8 4-16 7-25 10Z"
              className={styles.avatarHair}
            />
            <path d="M47 56c-4 12-3 24 2 35l7-7V57Z" className={styles.avatarHair} />
          </>
        ) : null}
        {hairVariant === 4 ? (
          <>
            <path
              d="M45 61c-2-25 12-40 35-40 18 0 30 9 36 27-8-5-17-7-25-5-12 3-20 12-46 18Z"
              className={styles.avatarHair}
            />
            <path d="M48 53c-6 12-6 25-1 38l8-9-1-27Z" className={styles.avatarHair} />
          </>
        ) : null}
        {hairVariant === 5 ? (
          <>
            <path
              d="M47 63c-1-19 8-34 23-40 16-6 34 0 42 17-12-6-23-7-34-3-12 4-22 13-31 26Z"
              className={styles.avatarHair}
            />
            <path d="M48 57c-6 11-6 24-1 36l8-10-1-25Z" className={styles.avatarHair} />
            <path d="M111 49c6 12 6 25 2 38l-7-8 1-27Z" className={styles.avatarHair} />
          </>
        ) : null}
        {hairVariant === 6 ? (
          <>
            <path
              d="M43 71c-4-31 10-50 37-50 28 0 42 20 38 51l-11-12-5-19c-14 12-31 18-52 18Z"
              className={styles.avatarHair}
            />
            <path d="M45 58c-8 15-7 37 3 52l11-14-4-40Z" className={styles.avatarHair} />
            <path d="M115 58c8 15 7 37-3 52l-11-14 4-40Z" className={styles.avatarHair} />
          </>
        ) : null}
        {hairVariant === 7 ? (
          <>
            <circle cx="80" cy="21" r="17" className={styles.avatarHair} />
            <path
              d="M44 66c-2-29 12-46 36-46s39 18 36 47c-9-7-14-16-16-27-13 12-30 17-56 26Z"
              className={styles.avatarHair}
            />
            <path d="M46 61c-5 13-4 27 2 40l8-14-2-29Z" className={styles.avatarHair} />
          </>
        ) : null}
        {hairVariant === 8 ? (
          <>
            <path
              d="M42 70c-3-32 11-51 38-51s42 20 39 52l-12-9-6-22c-13 13-31 19-53 19Z"
              className={styles.avatarHair}
            />
            <path d="M44 59c-8 20-6 46 6 65l12-19-7-49Z" className={styles.avatarHair} />
            <path d="M116 59c8 20 6 46-6 65l-12-19 7-49Z" className={styles.avatarHair} />
          </>
        ) : null}

        <path d="M59 72c5-3 10-3 15 0" className={styles.avatarFeatureLine} />
        <path d="M86 72c5-3 10-3 15 0" className={styles.avatarFeatureLine} />
        <circle cx="67" cy="79" r="2.6" className={styles.avatarEye} />
        <circle cx="93" cy="79" r="2.6" className={styles.avatarEye} />
        <path d="M80 80c-2 7-3 12-1 16l6 1" className={styles.avatarFeatureLine} />

        {expressionVariant === 0 ? (
          <path d="M68 104c8 5 16 5 24 0" className={styles.avatarExpression} />
        ) : null}
        {expressionVariant === 1 ? (
          <path d="M69 105c7 2 15 2 22 0" className={styles.avatarExpression} />
        ) : null}
        {expressionVariant === 2 ? (
          <path d="M69 104c4 5 18 5 22-1" className={styles.avatarExpression} />
        ) : null}

        {hasGlasses ? (
          <g className={styles.avatarGlasses}>
            <rect x="53" y="72" width="27" height="18" rx="7" />
            <rect x="81" y="72" width="27" height="18" rx="7" />
            <path d="M80 79h2M52 77l-7-3M108 77l7-3" />
          </g>
        ) : null}

        {hasBeard ? (
          <path
            d="M57 95c4 20 12 30 23 30s20-10 24-30c-4 8-12 13-24 13S61 103 57 95Z"
            className={styles.avatarBeard}
          />
        ) : null}

        {presentation === "feminine" ? (
          <g className={styles.avatarEarrings}>
            <circle cx="47" cy="91" r="2.8" />
            <circle cx="113" cy="91" r="2.8" />
          </g>
        ) : null}

        {isMature ? (
          <g className={styles.avatarAgeLine}>
            <path d="M57 86l-5 2M103 86l5 2" />
            <path d="M62 92c3 2 7 2 10 0M88 92c3 2 7 2 10 0" />
          </g>
        ) : null}
        {isSenior ? (
          <g className={styles.avatarAgeLine}>
            <path d="M67 57c8-2 17-2 25 0M69 62c7-2 15-2 22 0" />
            <path d="M61 99c-2 4-3 8-2 12M99 99c2 4 3 8 2 12" />
          </g>
        ) : null}

        {attireVariant === 0 ? (
          <>
            <path d="m76 154 4 5 4-5 5 26H71Z" className={styles.avatarTie} />
            <path d="M112 151h16" className={styles.avatarPocketSquare} />
          </>
        ) : null}
        {attireVariant === 1 ? (
          <>
            <path d="M70 147c3 4 6 6 10 6s7-2 10-6" className={styles.avatarCollarLine} />
            <path d="M112 151h8l5-5" className={styles.avatarPocketSquare} />
          </>
        ) : null}
        {attireVariant === 2 ? (
          <>
            <circle cx="80" cy="154" r="3" className={styles.avatarAccessory} />
            <path d="M73 144c1 9 3 13 7 13s6-4 7-13" className={styles.avatarCollarLine} />
          </>
        ) : null}

        <path d="M22 179c5-22 18-37 37-45" className={styles.avatarJacketLine} />
        <path d="M138 179c-5-22-18-37-37-45" className={styles.avatarJacketLine} />
        <circle cx="80" cy="171" r="2.4" className={styles.avatarJacketButton} />
      </svg>
    </span>
  );
}
