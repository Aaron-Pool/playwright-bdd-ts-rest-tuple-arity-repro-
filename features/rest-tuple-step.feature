Feature: Rest tuple step callback arity

  Scenario: Generate a step that destructures typed captured arguments from a rest tuple
    Given the following people exist:
      | Name  | Age | Country |
      | Alpha | 30  | USA     |
    And the following animals exist:
      | Name  | Age | Species |
      | Beta  | 5   | Dog     |
    Then everything is fine
