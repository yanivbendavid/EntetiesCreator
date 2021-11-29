import { useRef, useReducer, useState } from "react";
import { addEntity } from "../api/api";
import styles from "./Creator.module.css";

const defaultState = { nameIsValid: null, xIsValid: null, yIsValid: null };
const reducer = (prevState, action) => {
  switch (action.type) {
    case "NAME":
      return {
        nameIsValid: action.value,
        xIsValid: prevState.xIsValid,
        yIsValid: prevState.yIsValid,
      };
    case "XPOS":
      return {
        nameIsValid: prevState.nameIsValid,
        xIsValid: action.value,
        yIsValid: prevState.yIsValid,
      };
    case "YPOS":
      return {
        nameIsValid: prevState.nameIsValid,
        xIsValid: prevState.xIsValid,
        yIsValid: action.value,
      };
    default:
      return defaultState;
  }
};

export default function Creator(props) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const nameInput = useRef();
  const xPos = useRef();
  const yPos = useRef();
  const [posLog, setPosLog] = useState("");

  const addEntityHandler = async (event) => {
    event.preventDefault();

    const name = nameInput.current.value.trim();
    const x = xPos.current.value.trim();
    const y = yPos.current.value.trim();

    //simple validation

    dispatch({ type: "NAME", value: name.length > 0 });
    dispatch({ type: "XPOS", value: x.length > 0 });
    dispatch({ type: "YPOS", value: y.length > 0 });

    if (!state.nameIsValid || !state.xIsValid || !state.yIsValid) {
      return;
    }

    const entity = { name, x, y };
    const id = await addEntity(entity);

    console.log({ addedId: id.name });
    nameInput.current.value = "";
    xPos.current.value = "";
    yPos.current.value = "";
    setPosLog(`New position added at ${x},${y}`);
  };

  return (
    <section className={styles.section}>
      <h1>Add new entity</h1>
      <form onSubmit={addEntityHandler}>
        <table className={styles.control}>
          <tbody>
            <tr>
              <td>
                <label htmlFor="name">Name</label>
              </td>
              <td>
                <input type="name" id="name" ref={nameInput} />
                <div className={styles.error}>
                  {state.nameIsValid === false && <div>Invalid name</div>}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="x">X</label>
              </td>
              <td>
                <input type="number" id="x" ref={xPos} max="1000" min="1" />
                <div className={styles.error}>
                  {state.xIsValid === false && <div>Invalid x position</div>}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="y">Y</label>
              </td>
              <td>
                <input type="number" id="y" ref={yPos} max="1000" min="1" />
                <div className={styles.error}>
                  {state.yIsValid === false && <div>Invalid y position</div>}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className={styles.actions}>
                  <button>Send</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div>{posLog}</div>
      </form>
    </section>
  );
}
