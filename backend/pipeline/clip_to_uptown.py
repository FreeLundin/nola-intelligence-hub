from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]


def main() -> None:
    print("This placeholder script would clip raw city data to the Uptown boundary defined in the scenario spec.")
    print(f"Project root: {PROJECT_ROOT}")


if __name__ == "__main__":
    main()
