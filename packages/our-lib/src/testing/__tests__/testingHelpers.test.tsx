import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import {
  clickButton,
  fillFormFields,
  getField,
  queryField,
  renderWithProviders,
  selectAsyncComboboxOption,
} from "../index";

const ExampleForm = ({ onSubmit }: { onSubmit?: () => void }) => {
  const [ownerQuery, setOwnerQuery] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState("Alex Carter");
  const ownerOptions = ["Alex Carter", "Morgan Lee", "Jamie Patel"];

  const matchingOptions = ownerOptions.filter((option) => option.toLowerCase().includes(ownerQuery.toLowerCase()));

  return (
    <form>
      <label>
        Title
        <input aria-label="Title" defaultValue="" />
      </label>

      <label>
        Count
        <input aria-label="Count" defaultValue="0" />
      </label>

      <label>
        Owner
        <input
          aria-label="Owner"
          placeholder="Search owners"
          role="combobox"
          value={selectedOwner}
          onChange={(event) => {
            setOwnerQuery(event.target.value);
            setSelectedOwner(event.target.value);
            setShowOptions(true);
          }}
        />
      </label>

      {showOptions ? (
        <ul>
          {matchingOptions.map((option) => (
            <li
              aria-label={option}
              key={option}
              role="option"
              onMouseDown={() => {
                setSelectedOwner(option);
                setShowOptions(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      ) : null}

      <label>
        Owner Name
        <input aria-label="Owner Name" value={selectedOwner} onChange={(event) => setSelectedOwner(event.target.value)} />
      </label>

      <button type="button" onClick={onSubmit}>
        Save
      </button>
    </form>
  );
};

describe("testing helpers", () => {
  it("renderWithProviders renders content", () => {
    renderWithProviders(<div>Helper Rendered</div>);

    expect(screen.getByText("Helper Rendered")).toBeInTheDocument();
  });

  it("fillFormFields updates text and number-like inputs", () => {
    renderWithProviders(<ExampleForm />);

    fillFormFields({
      Title: "Testing Helpers",
      Count: 12,
    });

    expect(screen.getByDisplayValue("Testing Helpers")).toBeInTheDocument();
    expect(screen.getByDisplayValue("12")).toBeInTheDocument();
  });

  it("queryField returns a field when one exists", () => {
    renderWithProviders(<ExampleForm />);

    expect(queryField("Title")).toBeTruthy();
  });

  it("queryField returns null when a field does not exist", () => {
    renderWithProviders(<ExampleForm />);

    expect(queryField("Missing Field")).toBeNull();
  });

  it("getField returns a field when one exists", () => {
    renderWithProviders(<ExampleForm />);

    expect(getField("Title")).toBeInstanceOf(HTMLElement);
  });

  it("getField throws when a field does not exist", () => {
    renderWithProviders(<ExampleForm />);

    expect(() => getField("Missing Field")).toThrow('Unable to find a form field named "Missing Field".');
  });

  it("clickButton triggers a button click by accessible name", () => {
    const onSubmit = vi.fn();
    renderWithProviders(<ExampleForm onSubmit={onSubmit} />);

    clickButton("Save");

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("selectAsyncComboboxOption selects a matching async option", async () => {
    renderWithProviders(<ExampleForm />);

    await selectAsyncComboboxOption("Search owners", "Morgan", /Morgan Lee/i);

    await waitFor(() => {
      expect(screen.getAllByDisplayValue("Morgan Lee").length).toBeGreaterThanOrEqual(2);
    });
  });
});
