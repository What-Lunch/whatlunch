const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const foodsDir = path.join(__dirname, '../public/foods');
const categories = ['Chinese', 'Japanese', 'Korean', 'Snack', 'Western'];

async function compressImages() {
  let totalSaved = 0;
  let processedCount = 0;

  for (const category of categories) {
    const categoryPath = path.join(foodsDir, category);
    const files = fs.readdirSync(categoryPath);

    for (const file of files) {
      if (!file.endsWith('.png')) continue;

      const inputPath = path.join(categoryPath, file);
      const outputPath = inputPath; // 같은 이름으로 덮어쓰기
      const backupPath = inputPath + '.backup'; // 백업

      try {
        const originalSize = fs.statSync(inputPath).size;

        // 원본 백업
        fs.copyFileSync(inputPath, backupPath);

        // PNG 압축 (품질 유지하면서 크기 줄이기)
        await sharp(inputPath)
          .png({
            quality: 85,
            compressionLevel: 9,
            palette: true, // 256 colors로 최적화
          })
          .resize(800, 800, {
            // 최대 800x800으로 리사이즈
            fit: 'inside',
            withoutEnlargement: true,
          })
          .toFile(outputPath + '.tmp');

        const newSize = fs.statSync(outputPath + '.tmp').size;
        const saved = originalSize - newSize;

        if (saved > 0) {
          // 임시 파일을 원본으로 교체
          fs.renameSync(outputPath + '.tmp', outputPath);
          totalSaved += saved;
          processedCount++;
          console.log(
            `${category}/${file}: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${(saved / 1024).toFixed(0)}KB 절약)`
          );
        } else {
          // 압축 효과 없음 — 원본 유지
          fs.unlinkSync(outputPath + '.tmp');
        }

        // 백업 삭제
        fs.unlinkSync(backupPath);
      } catch (error) {
        console.error(`${category}/${file} 압축 실패:`, error.message);
        // 에러 발생 시 백업에서 복구
        if (fs.existsSync(backupPath)) {
          fs.copyFileSync(backupPath, inputPath);
          fs.unlinkSync(backupPath);
        }
      }
    }
  }

  console.log(
    `\n완료! ${processedCount}개 파일 처리, 총 ${(totalSaved / 1024 / 1024).toFixed(2)}MB 절약`
  );
}

compressImages().catch(console.error);
