import React, { useState } from "react";
import { Checkbox, Popover, Button } from "antd";
import { FilterTwoTone } from "@ant-design/icons";

function CheckBox(props) {
  const [Checked, setChecked] = useState([]);
  const [visible, setvisible] = useState(false);

  const handleToggle = (value) => {
    //누른 것의 Index를 구하고
    const currentIndex = Checked.indexOf(value);
    // 전체 Checked된 State에서 현재 누른 Checkbox가 이미 있다면
    const newChecked = [...Checked];
    // State 넣어준다.
    if (currentIndex === -1) {
      newChecked.push(value);
      // 빼주고
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    props.handleFilters(newChecked);
  };

  const renderCheckboxLists = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox
          onChange={() => handleToggle(value.name)}
          checked={Checked.indexOf(value.name) === -1 ? false : true}
          style={{ paddingBottom: "10px" }}
        />
        <span style={{ paddingRight: "7px" }}>{value.name}</span>
      </React.Fragment>
    ));

  const handleVisibleChange = (visible) => {
    setvisible(visible);
  };

  return (
    <div>
      <Popover
        content={renderCheckboxLists()}
        title="게시물 종류"
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <Button
          type="primary"
          style={{ backgroundColor: "white", width: "104px" }}
        >
          <FilterTwoTone style={{ fontSize: 20 }} />
        </Button>
      </Popover>
    </div>
  );
}

export default CheckBox;
