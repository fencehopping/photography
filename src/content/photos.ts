import type { Photo, PhotoCategory } from '../types';

const imageModules = import.meta.glob('../../images/*.jpg', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

const localImageFiles = [
  'sarahcroninphotography_1589654666_2310513264832075297_11699371847.jpg',
  'sarahcroninphotography_1589654666_2310513264848839924_11699371847.jpg',
  'sarahcroninphotography_1589654666_2310513264857414537_11699371847.jpg',
  'sarahcroninphotography_1654638913_2855640639686579236_11699371847.jpg',
  'sarahcroninphotography_1654867544_2857558534172206322_11699371847.jpg',
  'sarahcroninphotography_1655024946_2858878918855258949_11699371847.jpg',
  'sarahcroninphotography_1657642268_2880834606652862003_11699371847.jpg',
  'sarahcroninphotography_1657643421_2880844281192620710_11699371847.jpg',
  'sarahcroninphotography_1657643617_2880845924847996900_11699371847.jpg',
  'sarahcroninphotography_1657644167_2880850533951891592_11699371847.jpg',
  'sarahcroninphotography_1657645528_2880861952164441984_11699371847.jpg',
  'sarahcroninphotography_1657645716_2880863533802861069_11699371847.jpg',
  'sarahcroninphotography_1657647207_2880876035907993446_11699371847.jpg',
  'sarahcroninphotography_1657770210_2881907864747782097_11699371847.jpg',
  'sarahcroninphotography_1657770597_2881911107599093271_11699371847.jpg',
  'sarahcroninphotography_1657771194_2881916117795965087_11699371847.jpg',
  'sarahcroninphotography_1657771456_2881918314629759589_11699371847.jpg',
  'sarahcroninphotography_1657771877_2881921845889764050_11699371847.jpg',
  'sarahcroninphotography_1658067778_2884404041514785539_11699371847.jpg',
  'sarahcroninphotography_1659827050_2899161883312554784_11699371847.jpg',
  'sarahcroninphotography_1659827101_2899162312196859518_11699371847.jpg',
  'sarahcroninphotography_1675542656_3030993947334543357_11699371847.jpg',
  'sarahcroninphotography_1678482675_3055656607576063633_11699371847.jpg',
  'sarahcroninphotography_1680120849_3069398608574338307_11699371847.jpg',
  'sarahcroninphotography_1680120849_3069398608574407999_11699371847.jpg',
  'sarahcroninphotography_1680396712_3071712721133210433_11699371847.jpg',
  'sarahcroninphotography_1685653531_3115810111604200868_11699371847.jpg',
  'sarahcroninphotography_1685653531_3115810111772039156_11699371847.jpg',
  'sarahcroninphotography_1701370762_3247655804427654785_11699371847.jpg',
  'sarahcroninphotography_1703102535_3262182968306439738_11699371847.jpg',
  'sarahcroninphotography_1703214828_3263124951345985706_11699371847.jpg',
  'sarahcroninphotography_1716154493_3371670727886294490_11699371847.jpg',
  'sarahcroninphotography_1716599868_3375406797949237914_11699371847.jpg',
  'sarahcroninphotography_1716746887_3376640084092083369_11699371847.jpg',
  'sarahcroninphotography_1716746921_3376640373046049204_11699371847.jpg',
  'sarahcroninphotography_1722200712_3422390085293571980_11699371847.jpg',
  'sarahcroninphotography_1724457672_3441322839665439741_11699371847.jpg',
  'sarahcroninphotography_1725163264_3447241772255843270_11699371847.jpg',
  'sarahcroninphotography_1740371249_3574815599063401023_11699371847.jpg',
  'sarahcroninphotography_1752290670_3674802945023566431_11699371847.jpg',
  'sarahcroninphotography_1752897914_3679896884105738634_11699371847.jpg',
  'sarahcroninphotography_1755794224_3704192890398243366_11699371847.jpg',
  'sarahcroninphotography_1759356163_3734072597013973963_11699371847.jpg',
  'sarahcroninphotography_1759356163_3734072597114619403_11699371847.jpg',
  'sarahcroninphotography_1763068493_3765213883770963164_11699371847.jpg',
  'sarahcroninphotography_1763227923_3766551275551401472_11699371847.jpg',
  'sarahcroninphotography_1779498722_3903040544287256316_11699371847.jpg',
];

const categories: PhotoCategory[] = ['Weddings', 'Portraits', 'Families', 'Lifestyle', 'Events'];

function getTimestamp(filename: string): number | undefined {
  const match = filename.match(/_(\d{10})_/);
  return match ? Number(match[1]) : undefined;
}

function formatTitle(index: number): string {
  return `Portfolio Frame ${String(index + 1).padStart(2, '0')}`;
}

function formatDate(timestamp: number | undefined): string | undefined {
  if (!timestamp) {
    return undefined;
  }

  return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

// TODO: Replace this local file list with a CMS/upload-backed adapter when real work is ready.
// Keep the Photo shape stable so components do not need to change when the source changes.
export const photos: Photo[] = localImageFiles.map((filename, index) => {
  const timestamp = getTimestamp(filename);
  const title = formatTitle(index);

  return {
    id: filename.replace(/\.[^.]+$/, ''),
    src: imageModules[`../../images/${filename}`],
    alt: `${title} by Sara Cohen`,
    category: categories[index % categories.length],
    title,
    featured: index % 9 === 0,
    metadata: {
      date: formatDate(timestamp),
      cmsAssetId: filename,
    },
  };
});
