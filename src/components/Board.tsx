import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { boardOrderState, IToDo, toDoState } from "../atom";
import DraggableCard from "./DraggableCard";
import React from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { IoIosMenu, IoIosClose } from "react-icons/io";

const Wrapper = styled.div<{ isDragging: boolean }>`
  width: 200px;
  height: 300px;
  display: flex;

  background-color: ${(props) => (props.isDragging ? "#c2cadb" : "#dadfe9")};

  transition: background-color 0.5s ease-in-out;

  padding: 10px;

  border-radius: 10px;

  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
`;

const Title = styled.span`
  width: 100%;
  font-size: 18px;
  font-weight: 400;
`;

const Handle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;

  &:hover {
    opacity: 0.8;
  }
`;

const Delete = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;

  margin-left: 5px;

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const Form = styled.form`
  width: 100%;
  margin-top: 10px;
`;

const Input = styled.input`
  width: 100%;
  &:focus {
    outline: 1px solid #7f8081;
  }

  border-radius: 5px;

  color: #7f8081;

  height: 25px;

  border: none;

  background-color: white;

  text-align: center;
`;

interface IAreaProps {
  draggingFromThisWith: boolean;
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.draggingFromThisWith
      ? "#b2bec3"
      : "transparent"};

  transition: background-color 0.5s ease-in-out;
  flex-grow: 1;
  padding: 20px;
  border-radius: 5px;
  min-height: 200px;
`;

interface IBoard {
  boardId: string;
  toDos: IToDo[];
  index: number;
}

interface IForm {
  toDo: string;
}

function Board({ boardId, toDos, index }: IBoard) {
  const setToDos = useSetRecoilState(toDoState);
  const setOrder = useSetRecoilState(boardOrderState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };
  const deleteBoard = (e: React.MouseEvent<HTMLElement>) => {
    const element = e.target as HTMLElement;
    const board = element.className;
    const boardId = Object(board).animVal;

    setToDos((allBoards) => {
      const copy = { ...allBoards };
      delete copy[boardId];
      return copy;
    });

    setOrder((order) => {
      const index = order.indexOf(boardId);
      const copy = [...order];
      copy.splice(index, 1);
      return copy;
    });
  };
  return (
    <Draggable draggableId={"Board_" + boardId} index={index}>
      {(provided, snapshot) => (
        <Wrapper
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.draggableProps}
          datatype="Board"
        >
          <Header>
            <Title>{boardId}</Title>
            <Handle {...provided.dragHandleProps}>
              <IoIosMenu />
            </Handle>
            <Delete onClick={deleteBoard}>
              <IoIosClose className={boardId} />
            </Delete>
          </Header>
          <Form onSubmit={handleSubmit(onValid)}>
            <Input
              {...register("toDo", { required: true })}
              type="text"
              placeholder={`Add Task on ${boardId}`}
              autoComplete="off"
            ></Input>
          </Form>
          <Droppable droppableId={boardId}>
            {(provided, snapshot) => (
              <Area
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
                draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
              >
                {toDos.map((toDo, index) => (
                  <DraggableCard
                    key={toDo.id}
                    index={index}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                  ></DraggableCard>
                ))}
                {provided.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Board);
