import asyncio
import os
import edge_tts

VOICE = "en-US-ChristopherNeural"

TEXT = (
    "In Gainesville, Florida, clean energy is not merely an environmental goal, it is a climate survival crisis. "
    "East of Waldo Road in ZIP 32641, families spend nearly 15% of income on electricity bills. Meet GridAegis GNV. "
    "GridAegis GNV bridges geospatial analytics with municipal policy, overlaying Alachua County census data with NASA ECOSTRESS thermal data to reveal a 4.2 degree heat island, simulating urban canopy savings. "
    "Our sub-20ms Directed Acyclic Graph engine models cascading grid collapse across Hogtown Creek and Sugarfoot, securing UF Health Shands with our 72-hour microgrid battery dispatch solver. "
    "Google Gemini multimodal intelligence ingests GRU utility bills and meters, extracts tiered rates, and drafts official Florida LIHEAP hardship applications with Spanish translation and browser voice triage. "
    "When cellular networks fail, our zero-bandwidth Offline Shelter Pass provides printable disaster life-support guides. GridAegis GNV delivers an equitable, resilient future for Gainesville."
)

OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "public", "presentation", "presentation-voice.mp3")

async def main():
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    print(f"Generating voiceover with voice: {VOICE} ...")
    communicate = edge_tts.Communicate(TEXT, VOICE, rate="+0%", pitch="+0Hz")
    await communicate.save(OUTPUT_FILE)
    print(f"Voiceover successfully generated at: {OUTPUT_FILE}")

if __name__ == "__main__":
    asyncio.run(main())
