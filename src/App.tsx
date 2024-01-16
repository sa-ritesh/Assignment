import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { inputPlaceholder, optionsList } from "./constants";
interface User {
  name: string;
  email: string;
}
function App() {
  //options to be displayed for selecting
  const [options, setOptions] = useState<User[]>(optionsList);

  //input value
  const [fieldValue, setFieldValue] = useState<string>("");

  //is selecting options visible
  const [isListVisible, setListVisibility] = useState<boolean>(false);

  //Users selected list
  const [selectedChips, setSelectedChips] = useState<User[]>([]);

  //currently focussed index in selecting list
  const [focusedIndex, setFocusedIndex] = useState<any>(null);

  //is last selected chip on focus for deleting using backspace
  const [lastIndexFocussed, setLastIndexFocussed] = useState<any>(false);

  //auto scroll list while going down using keys
  const scrollableListRef = useRef<any>(null);

  /**
   * Function to handle selection of a User from option list
   * @param element User option selected
   */
  const handleSelectChip = (element: User) => {
    setSelectedChips([...selectedChips, element]);
    setOptions(options.filter((item: User) => item.email != element.email));
  };

  /**
   * Function to handle deselction of a User from option list
   * @param element User option to be deselected
   */
  const handleDeselectChip = (element: User) => {
    setOptions([...options, element]);
    setSelectedChips(
      selectedChips.filter((item: User) => item.email != element.email)
    );
  };

  /**
   * Handling search functionality
   * @param inputValue current field value
   */
  const handleSearch = (inputValue: string) => {
    setFieldValue(inputValue);
    if (inputValue) {
      //if input has value filter
      setOptions(
        optionsList.filter((option: User) => {
          let index: number = selectedChips.findIndex(
            (chip: User) => chip.email == option.email
          );
          return (
            (!index || index == -1) &&
            option.name.toLowerCase().includes(inputValue.toLowerCase())
          );
        })
      );
    } else {
      //if empty then show all options
      setOptions(
        optionsList.filter((option: User) => {
          let index: number = selectedChips.findIndex(
            (chip: any) => chip.email == option.email
          );
          return !index || index == -1;
        })
      );
    }
  };

  const handleBackFunctionality = () => {
    //already pressed backspace once now delete
    if (lastIndexFocussed && selectedChips.length > 0) {
      handleDeselectChip(selectedChips[selectedChips.length - 1]);
      setLastIndexFocussed(false);
    } else {
      //highlight last selected User
      setLastIndexFocussed(true);
    }
    if (selectedChips.length == 0) {
      setListVisibility(false);
    }
  };
  /**
   * Hanlding all functionality using keyboard
   * @param event KeyDown event
   */
  const handleKeyDown = (event: any) => {
    //hovering options list
    if (event.key == "ArrowDown") {
      setFocusedIndex((prevIndex: any) => {
        return prevIndex == null
          ? 0
          : Math.min(prevIndex + 1, options.length - 1);
      });
    } else if (event.key == "ArrowUp") {
      setFocusedIndex((prevIndex: number) => {
        return prevIndex == null ? 0 : Math.max(prevIndex - 1, -1);
      });
    } else if (
      event.key == "Enter" &&
      focusedIndex != null &&
      options[focusedIndex] &&
      isListVisible
    ) {
      //select current hovered elemnt using enter key
      handleSelectChip(options[focusedIndex]);
    } else if (event.key == "Backspace" && !fieldValue) {
      handleBackFunctionality();
    }

    //deselcting already selected User on first backspace
    if (event.key != "Backspace") {
      setLastIndexFocussed(false);
    }
  };

  //hovering effect on User list from mouse
  const handleMouseOver = (index: number) => {
    setFocusedIndex(index);
  };

  const handleMouseOut = () => {
    setFocusedIndex(-1);
  };
  useEffect(() => {
    // Scroll to the focused item when it changes
    if (scrollableListRef.current) {
      const focusedItemElement =
        scrollableListRef.current.children[focusedIndex];
      if (focusedItemElement) {
        const containerHeight = scrollableListRef.current.clientHeight;
        const itemHeight = focusedItemElement.clientHeight;
        const scrollTo = focusedIndex * itemHeight;

        // Adjust the scroll position based on the container and item heights
        scrollableListRef.current.scrollTop = Math.max(
          0,
          scrollTo - containerHeight / 2
        );
      }
    }
  }, [focusedIndex]);

  return (
    <div className="App">
      <h1 className="header">Pick User Here...</h1>
      <div className="container">
        <ul className={"selectedList"} onKeyDown={handleKeyDown}>
          {selectedChips.map((element: User, index: number) => {
            return (
              <li
                className={`${
                  index == selectedChips.length - 1 && lastIndexFocussed
                    ? "bold"
                    : ""
                } chip`}
                key={element.email}
              >
                <FontAwesomeIcon icon={faCircleUser} className={"chipIcon"} />
                <span className={"chipName"}>{element.name}</span>
                <span
                  className={"chipX"}
                  onClick={() => {
                    handleDeselectChip(element);
                  }}
                >
                  X
                </span>
              </li>
            );
          })}
          <li className="inputContainer">
            <input
              placeholder={inputPlaceholder}
              value={fieldValue}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              onClick={() => {
                setListVisibility(true);
              }}
            />
            {isListVisible && options.length > 0 && (
              <ul ref={scrollableListRef} className="selectionList">
                {options.map((element: User, index: number) => {
                  return (
                    <li
                      className={index == focusedIndex ? "focused" : ""}
                      onClick={() => {
                        handleSelectChip(element);
                      }}
                      onMouseEnter={() => handleMouseOver(index)}
                      onMouseLeave={handleMouseOut}
                    >
                      <span className="optionProfile">
                        <FontAwesomeIcon
                          icon={faCircleUser}
                          className={"optionIcon"}
                        />
                        <span className="optionName">{element.name}</span>
                      </span>
                      <span className="optionEmail">{element.email}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
