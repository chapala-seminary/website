"""Regression checks using delivered packets, including rejected corruptions."""
import contextlib
import io
import json
from pathlib import Path
import tempfile
import unittest

import validate

ROOT = Path(__file__).resolve().parent.parent


class PacketValidation(unittest.TestCase):
    def check_packet(self, source, draft):
        with contextlib.redirect_stdout(io.StringIO()) as output:
            result = validate.main(source, draft)
        return result, output.getvalue()

    def test_every_delivered_packet(self):
        sources = sorted(ROOT.glob('*/*-source.json'))
        self.assertTrue(sources)
        for source in sources:
            with self.subTest(packet=source.name):
                result, output = self.check_packet(source, source.with_name(
                    source.name.replace('-source.json', '-fr.json')))
                self.assertEqual(result, 0, output)

    def corrupted_packet(self, course, mutate):
        source = ROOT / course / f'{course}-unit1-source.json'
        draft = json.loads(source.with_name(source.name.replace('-source', '-fr')).read_text())
        mutate(draft)
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'draft.json'
            path.write_text(json.dumps(draft))
            return self.check_packet(source, path)

    def test_duplicate_legacy_blocks_are_rejected(self):
        result, output = self.corrupted_packet('CTSNT', lambda d: d['blocks'].append(d['blocks'][0]))
        self.assertEqual(result, 1)
        self.assertIn('duplicate French block ids', output)

    def test_missing_dictionary_block_is_rejected(self):
        result, output = self.corrupted_packet('CTSJohn', lambda d: d['blocks'].pop(next(iter(d['blocks']))))
        self.assertEqual(result, 1)
        self.assertIn('missing French', output)

    def test_genesis_missing_keyword_group_is_rejected(self):
        result, output = self.corrupted_packet('CTSGenesis', lambda d: d['sa'][0]['keywords'].pop())
        self.assertEqual(result, 1)
        self.assertIn('French needs 8 groups', output)


if __name__ == '__main__':
    unittest.main()
