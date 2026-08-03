import fontforge
import xml.etree.ElementTree as ET


def read_kerns(filename):
    tree = ET.parse(filename)
    root = tree.getroot()

    ns = {"svg": "http://www.w3.org/2000/svg"}

    hkerns = root.findall(".//svg:hkern", ns)

    kern_pairs = []
    for hk in hkerns:
        u1 = hk.get("u1")
        u2 = hk.get("u2")
        k = float(hk.get("k"))
        kern_pairs.append((u1, u2, k))

    return kern_pairs


def generate_fonts(basename, majver, minver, years, weight, italicangle, upos, uwidth, fc):
    print(basename)
    filename = f"fonts/{basename}/{basename}.svg"

    font = fontforge.open(filename)

    suffix = f"-{weight}" if weight != "Regular" else ""
    font.fontname = font.familyname + suffix
    font.fullname = font.fontname
    font.version = f"{majver}.{minver}"

    font.weight = weight
    font.italicangle = italicangle
    font.upos = upos
    font.uwidth = uwidth

    font.woffMajor = majver
    font.woffMinor = minver

    font.copyright = f"Copyright(c) {years}, wazuka-rail."

    font.os2_family_class = fc
    font.os2_weight = {
        "Thin": 100,
        "Extra-Light": 200,
        "Light": 300,
        "Regular": 400,
        "Medium": 500,
        "Semi-Bold": 600,
        "Bold": 700,
        "Extra-Bold": 800,
        "Black": 900,
    }[weight]

    # ID 2: Font Subfamily
    font.appendSFNTName("English (US)", 2, weight)

    # ID 3: Unique ID
    font.appendSFNTName("English (US)", 3, font.familyname + f"-{weight}")

    license = "This font is licensed under the SIL Open Font License, Version 1.1."
    # ID 13: License Description
    font.appendSFNTName("English (US)", 13, license)

    # ID 14: License Info URL
    font.appendSFNTName("English (US)", 14, "https://openfontlicense.org/")

    for glyph in font.glyphs():
        glyph.correctDirection()

        res = glyph.validate()
        if res != 0:
            print(glyph.glyphname, hex(glyph.unicode), hex(res))

    kern_pairs = read_kerns(filename)

    if len(kern_pairs) > 0:
        font.addLookup(
            "kern_lookup",
            "gpos_pair",
            None,
            (("kern", (("latn", ("dflt",)),)),),
        )
        font.addLookupSubtable("kern_lookup", "kern_subtable")

        for left, right, kern in kern_pairs:
            if left in font and right in font:
                skern = round(-kern * 1000 / font.em)
                font[left].addPosSub("kern_subtable", right, 0, 0, skern, 0, 0, 0, 0, 0)

    font.generate(f"../public/fonts/{basename}.ttf")
    font.generate(f"../public/fonts/{basename}.woff2")
    font.close()


generate_fonts("ticket-date", 0, 1, "2026", "Regular", -12, -256, 100, 0xA0)

generate_fonts("ticket-misc", 0, 1, "2026", "Regular", 0, -200, 100, 0x20)
