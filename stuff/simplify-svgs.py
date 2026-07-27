import os
import glob
import sys
import io
import re
import math
import datetime
import warnings
import xml.etree.ElementTree as ET


class SVGFormatter(ET.TreeBuilder):
    PAT_REAL = re.compile("[+-]?([0-9]+(\.[0-9]*)?|\.[0-9]+)([eE][+-]?[0-9]+)?")

    def __init__(self, output):
        self.ns = {}
        self.prefixes = {"http://www.w3.org/XML/1998/namespace": "xmlns"}
        self.tags = []
        self.xmlspace = []
        self.open = False
        self.output = output  # sys.stdout

        self.output.write("""<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n""")
        return

    def depth(self):
        return len(self.tags)

    def space_preserved(self):
        return len(self.xmlspace) > 0 and self.xmlspace[-1]

    def start(self, tag, attrs):
        f = self.output

        if self.depth() == 0:
            f.write("\n")

        if self.open:
            f.write(">" if self.space_preserved() else ">\n")
        self.open = True

        if not self.space_preserved():
            f.write("  " * self.depth())

        stag = self.replace_ns(tag)
        self.tags.append(stag)

        xmlspace = self.space_preserved()

        sattrs = []
        for kv in sorted(attrs.items()):
            k = self.replace_ns(kv[0])
            v = kv[1]

            # xml:space
            if k == "xml:space":
                if xmlspace and v == "preserve":
                    continue
                xmlspace = v == "preserve"
            # auto-generated IDs
            elif k == "id":
                if re.match(r"(?:g|image|path|rect|text|tspan|use)[\d-]+$", v):
                    continue
            # transform
            elif k == "transform":
                v = self.round_numbers(v)
            # stile:
            elif k == "style":
                if len(v) > 100:
                    warnings.warn("long `style` attr.:" + v)
            # viewing condition
            elif stag == "sodipodi:namedview":
                if re.match(r"inkscape:(?:zoom|cx|cy|current-layer|window-.+)", k):
                    continue
            elif stag == "path":
                # nodetypes
                if k == "sodipodi:nodetypes":
                    continue
                # d
                elif k == "d":
                    v = self.round_numbers(v)
            elif stag == "use":
                if k in ("x", "y"):
                    continue
            elif stag == "rect":
                if k in ("x", "y", "width", "height", "rx", "ry"):
                    v = self.round_numbers(v)
            elif stag == "circle":
                if k in ("cx", "cy", "r"):
                    v = self.round_numbers(v)
            elif stag in ("text", "tspan"):
                if k in ("x", "y"):
                    v = self.round_numbers(v)
            sattrs.append((k, v))

        self.xmlspace.append(xmlspace)

        f.write(f"<{stag}")

        for kv in sattrs:
            f.write(f'''\n{"  " * self.depth()} {kv[0]}="{kv[1]}"''')

        if stag == "svg":
            for pu in sorted(self.ns.items()):
                prefix = "xmlns" + ("" if pu[0] == "" else ":") + pu[0]
                f.write(f'''\n{"  " * self.depth()} {prefix}="{pu[1]}"''')
        return

    def end(self, tag):
        f = self.output

        stag = self.replace_ns(tag)
        if stag != self.tags.pop():
            raise ValueError(f"not well-formed:<{stag}>")

        if self.open:
            f.write(" />")
        elif self.space_preserved():
            f.write(f"</{stag}>")
        else:
            f.write(f"""{"  " * self.depth()}</{stag}>""")

        self.xmlspace.pop()
        if not self.space_preserved():
            f.write("\n")

        self.open = False
        return

    def data(self, data):
        f = self.output
        if self.open:
            f.write(">" if self.space_preserved() else ">\n")
        self.open = False
        if not self.space_preserved() and re.match("\s*$", data):
            return
        f.write(data)
        return

    def comment(self, text):
        self.output.write(f"""{"  " * self.depth()}<!--{text}-->\n""")
        return

    def start_ns(self, prefix, uri):
        self.ns[prefix] = uri
        if prefix != "":
            self.prefixes[uri] = prefix
        return

    def replace_ns(self, name):
        m = re.match(r"{([^\]]*)}(.*)", name)
        if not m:
            return name
        uri, n = m.group(1, 2)
        if uri == "http://www.w3.org/XML/1998/namespace" and n in ("space", "lang"):
            return "xml:" + n
        if uri == self.ns[""]:
            return n
        return self.prefixes[uri] + ":" + n

    def round_numbers(self, attr):
        def _round(x, sig):
            if x == 0.0:
                return x
            return round(x, sig - int(math.floor(math.log10(abs(x)))) - 1)

        def _round_number(m):
            v = m.group(0)
            v2 = _round(float(v) * 2, 5) / 2
            rv = str(int(v2) if v2.is_integer() else v2)
            return rv if len(rv) <= len(v) else v

        sv = self.PAT_REAL.sub(_round_number, attr)
        return sv


def simplify(filepath):
    print(filepath)

    svg = ""
    with open(filepath, "r") as f:
        svg = f.read()

    if not "inkscape" in svg:
        return 0

    out = io.StringIO("")
    parser = ET.XMLParser(target=SVGFormatter(out), encoding="utf-8")

    parser.feed(svg)

    simplified = out.getvalue()

    if simplified == svg:
        return 0

    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    with open(filepath + "_" + ts + ".bak", "w") as f:
        f.write(svg)

    with open(filepath, "w") as f:
        f.write(simplified)

    print(f"{filepath}: simplified")
    return 1


rootdir = os.path.dirname(__file__)

changed = 0
for filepath in glob.glob(os.path.join(rootdir, "**/*.svg"), recursive=True):
    changed += simplify(filepath)

exit(0 if changed == 0 else 1)
