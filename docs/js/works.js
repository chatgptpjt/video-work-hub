/**
 * MET動画編集チーム - 作品データ
 *
 * 作品を追加する場合：
 * 1. 下記の WORKS 配列に新しいオブジェクトを追加
 * 2. category は CATEGORIES に定義されているものを使用
 * 3. videoUrl と thumbnail は後から追加可能
 */

// カテゴリ定義
const CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'izakaya', label: '居酒屋' },
  { id: 'cafe', label: 'カフェ' },
  { id: 'restaurant', label: 'レストラン' },
  { id: 'ramen', label: 'ラーメン' },
  { id: 'sweets', label: 'スイーツ' },
  { id: 'other', label: 'その他' }
];

// 作品データ
const WORKS = [
  {
    id: 1,
    title: "居酒屋PR動画",
    category: "izakaya",
    videoUrl: "",        // ← 後でURL追加
    thumbnail: "",       // ← 後でサムネイル追加
    description: "デート向け居酒屋の魅力を伝えるリール動画"
  },
  {
    id: 2,
    title: "カフェ紹介リール",
    category: "cafe",
    videoUrl: "",
    thumbnail: "",
    description: "おしゃれカフェのメニューと雰囲気を紹介"
  },
  {
    id: 3,
    title: "ラーメン店舗PR",
    category: "ramen",
    videoUrl: "",
    thumbnail: "",
    description: "こだわりのスープと麺を魅せるショート動画"
  },
  {
    id: 4,
    title: "イタリアンレストラン",
    category: "restaurant",
    videoUrl: "",
    thumbnail: "",
    description: "高級感のある店舗イメージ動画"
  },
  {
    id: 5,
    title: "スイーツ専門店",
    category: "sweets",
    videoUrl: "",
    thumbnail: "",
    description: "季節限定スイーツのプロモーション"
  },
  {
    id: 6,
    title: "居酒屋チェーン",
    category: "izakaya",
    videoUrl: "",
    thumbnail: "",
    description: "複数店舗の統一感あるブランディング動画"
  }
];
