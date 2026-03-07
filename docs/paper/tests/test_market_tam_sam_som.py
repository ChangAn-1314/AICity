import re
import unittest
from pathlib import Path


CHAPTER4_PATH = Path(__file__).resolve().parents[1] / "chapters" / "chapter4.tex"


class TestMarketTamSamSomSection(unittest.TestCase):
    def test_contains_tam_sam_som_subsection(self):
        content = CHAPTER4_PATH.read_text(encoding="utf-8")
        self.assertIn("\\subsubsection{TAM/SAM/SOM 市场空间测算}", content)

    def test_contains_three_level_market_definition(self):
        content = CHAPTER4_PATH.read_text(encoding="utf-8")
        self.assertIn("TAM (Total Addressable Market", content)
        self.assertIn("SAM (Serviceable Available Market", content)
        self.assertIn("SOM (Serviceable Obtainable Market", content)

    def test_contains_sam_and_som_formula(self):
        content = CHAPTER4_PATH.read_text(encoding="utf-8")
        self.assertRegex(content, re.compile(r"SAM\s*\\approx\s*110\s*\\times\s*15\\%"))
        self.assertRegex(
            content,
            re.compile(r"SOM_\{3\\text\{年\}\}\s*\\approx\s*SAM\s*\\times\s*0\.6\\%"),
        )


if __name__ == "__main__":
    unittest.main()
