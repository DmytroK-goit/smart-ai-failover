import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PromptForm from "@/componets/PromptForm";
import { describe, expect, it } from "vitest";

describe("PromptForm", () => {
    it("renders input", () => {
        render(<PromptForm />);

        expect(
            screen.getByPlaceholderText("Enter prompt...")
        ).toBeInTheDocument();
    });
});