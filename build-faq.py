#!/usr/bin/env python3
"""Сборка блока FAQ в index.html из tools/faq.py.

ЗАЧЕМ ГЕНЕРАТОР, А НЕ РУКАМИ. Видимый текст и микроразметка FAQPage
должны совпадать дословно — расхождение считается обманом разметки,
за это Google снимает сниппет и может наложить санкции. Генерируя
из одного источника, разойтись невозможно.

  ./build-faq.py          — собрать
  ./build-faq.py --check  — проверить совпадение (для preflight)
"""
import html, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).parent
sys.path.insert(0, str(ROOT / 'tools'))
from faq import FAQ, PENDING

BEGIN = '<!-- FAQ:BEGIN — собрано ./build-faq.py из tools/faq.py, руками не править -->'
END = '<!-- FAQ:END -->'
LD_BEGIN = '<!-- FAQ-LD:BEGIN -->'
LD_END = '<!-- FAQ-LD:END -->'


def section():
    e = html.escape
    items = '\n'.join(
        f'      <details class="faq-item"{" open" if k == 0 else ""}>\n'
        f'        <summary>{e(q)}</summary>\n'
        f'        <div class="faq-answer"><p>{e(a)}</p></div>\n'
        f'      </details>' for k, (q, a) in enumerate(FAQ))
    return f'''{BEGIN}
<section class="faq" id="faq">
  <div class="wrap">
    <div class="faq-head reveal">
      <h2>Частые вопросы</h2>
      <p>Если нужного вопроса нет — позвоните или напишите, ответим.</p>
    </div>
    <div class="faq-list stagger">
{items}
    </div>
  </div>
</section>
{END}'''


def ld():
    data = {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q,
                            "acceptedAnswer": {"@type": "Answer", "text": a}}
                           for q, a in FAQ]}
    return (f'{LD_BEGIN}\n<script type="application/ld+json">\n'
            + json.dumps(data, ensure_ascii=False, indent=2)
            + f'\n</script>\n{LD_END}')


def replace(text, begin, end, new, anchor):
    if begin in text:
        return re.sub(re.escape(begin) + r'.*?' + re.escape(end), lambda _: new, text, flags=re.S)
    return text.replace(anchor, new + '\n' + anchor, 1)


def main():
    p = ROOT / 'index.html'
    src = p.read_text(encoding='utf-8')
    out = replace(src, BEGIN, END, section(), '\n<footer')
    out = replace(out, LD_BEGIN, LD_END, ld(), '<link rel="stylesheet" href="styles.css">')

    if '--check' in sys.argv:
        if out != src:
            print('FAQ в index.html разошёлся с tools/faq.py — запустите ./build-faq.py')
            return 1
        # видимый текст обязан совпадать с разметкой
        for q, a in FAQ:
            if html.escape(q) not in src or html.escape(a) not in src:
                print(f'в разметке нет вопроса или ответа: {q[:40]}')
                return 1
        print(f'FAQ актуален: {len(FAQ)} вопросов, ждут ответа {len(PENDING)}')
        return 0

    p.write_text(out, encoding='utf-8')
    print(f'FAQ собран: {len(FAQ)} вопросов на странице + разметка FAQPage')
    if PENDING:
        print(f'\nЖдут ответа от заказчика ({len(PENDING)}) — на сайт не выведены:')
        for q in PENDING:
            print('  •', q)
    return 0


if __name__ == '__main__':
    sys.exit(main())
