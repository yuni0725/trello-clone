import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import Board from "./components/Board";
import { useRecoilState } from "recoil";
import { boardOrderState, IToDoState, toDoState } from "./atom";
import { useEffect } from "react";

const GlobalStyle = createGlobalStyle`
  ${reset}
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap');
  * {
    box-sizing : border-box;
  }
  body {
    font-family : 'Roboto', --apple-system;
    background-color : #3498db;
    color : black;
    line-height: 1.2;
    font-weight: 300;
  }

  a {
    text-decoration : none;
    color : inherit;
  }
`;

const Wrapper = styled.div`
  height: 85vh;
  width: 100vw;

  padding: 10px 40px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  flex-wrap: wrap;
  gap: 10px;
`;

const Footer = styled.div`
  height: 15vh;
  width: 100vw;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px 40px;
`;

const Bin = styled.div<{ isDraggingOver: boolean }>`
  border-radius: 50%;
  padding: 10px;
  svg {
    opacity: ${(props) => (props.isDraggingOver ? 0.6 : 1)};
    transition: opacity 0.5s ease-in-out;
  }
`;

const Plus = styled.div`
  cursor: pointer;
  padding: 10px;
`;

const Svg = styled.svg``;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [boardOrder, setBoardOrder] = useRecoilState(boardOrderState);
  const onDragEnd = (dragEndInfo: DropResult) => {
    const { type, destination, source } = dragEndInfo;
    if (!destination) return;

    console.log(dragEndInfo);
    if (type === "Board") {
      setBoardOrder((order) => {
        const orderCopy = [...order];
        const target = orderCopy.splice(source.index, 1);
        orderCopy.splice(destination.index, 0, target[0]);
        return orderCopy;
      });
    } else {
      if (destination.droppableId === source.droppableId) {
        setToDos((allBoards) => {
          const boardCopy = [...allBoards[source.droppableId]];
          const taskObj = boardCopy[source.index];
          boardCopy.splice(source.index, 1);
          boardCopy.splice(destination.index, 0, taskObj);
          return { ...allBoards, [source.droppableId]: boardCopy };
        });
      }
      if (destination?.droppableId === "Delete") {
        setToDos((allBoards) => {
          const sourceBoard = [...allBoards[source.droppableId]];
          sourceBoard.splice(source.index, 1);
          return {
            ...allBoards,
            [source.droppableId]: sourceBoard,
          };
        });
      }
      if (destination?.droppableId !== source.droppableId) {
        setToDos((allBoards) => {
          const sourceBoard = [...allBoards[source.droppableId]];
          const destinationBoard = [...allBoards[destination.droppableId]];
          const targetObj = sourceBoard[source.index];
          sourceBoard.splice(source.index, 1);
          destinationBoard.splice(destination.index, 0, targetObj);
          return {
            ...allBoards,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destinationBoard,
          };
        });
      }
    }
  };
  const onAddBoard = () => {
    const newBoardName = prompt("Write a new category name");
    if (newBoardName) {
      setToDos((allBoards) => {
        return { ...allBoards, [newBoardName]: [] };
      });

      console.log(toDos);

      setBoardOrder((order) => {
        return [...order, newBoardName];
      });

      console.log(boardOrder);
    }
  };
  useEffect(() => {
    setToDos((allBoards) => {
      const newBoards: IToDoState = {};
      boardOrder.map((key) => (newBoards[key] = allBoards[key]));
      return newBoards;
    });
  }, [boardOrder]);
  return (
    <>
      <GlobalStyle></GlobalStyle>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="allBoard" type="Board" direction="horizontal">
          {(provided) => (
            <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
              {Object.keys(toDos).map((boardId, index) => (
                <Board
                  boardId={boardId}
                  key={"Board_" + boardId}
                  toDos={toDos[boardId]}
                  index={index}
                ></Board>
              ))}
              {provided.placeholder}
            </Wrapper>
          )}
        </Droppable>
        <Footer>
          <Plus onClick={onAddBoard}>
            <Svg fill="#000000" width="60px" height="60px" viewBox="0 0 24 24">
              <path
                d="M11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44771 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8Z"
                fill="#000000"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z"
                fill="#000000"
              />
            </Svg>
          </Plus>
          <Droppable droppableId="Delete">
            {(provided, snapshot) => (
              <>
                <Bin
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  <Svg
                    fill="#000000"
                    id="Capa_1"
                    width="60px"
                    height="60px"
                    viewBox="0 0 408.483 408.483"
                  >
                    <path
                      d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316
              H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293
              c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z M189.216,171.329
              c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355
              c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356
              c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z"
                    />
                    <path
                      d="M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916
              c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944C356.467,26.819,350.692,21.043,343.567,21.043z"
                    />
                  </Svg>
                </Bin>
              </>
            )}
          </Droppable>
        </Footer>
      </DragDropContext>
    </>
  );
}

export default App;
