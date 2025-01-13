const colorStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    //   const color = chroma(data.color);
      return {
        ...styles,
        // backgroundColor: isDisabled
        //   ? undefined
        //   : isSelected
        //   ? "red"
        //   : isFocused
        //   ? "green"
        //   : undefined,
        // color: isDisabled
        //   ? '#ccc'
        //   : isSelected
        //   ? 'white'
        //   : 'black',
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? 'gray'
              : 'white'
            : undefined,
        },

      };
    },
    // input: (styles) => ({ ...styles, ...dot() }),
    // placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
    singleValue: (styles, {data}) => ({ 
        ...styles,  
        backgroundColor: 
            data.value === 'Shortage' ? '#FFB3B3' : 
            data.value === "Delayed" ? "#F64242" : 
            data.value === "On Schedule" ? "#35A535" : 
            "white",
        textAlign: "center",
        padding: "3px 0 3px 0",
        color: 
            data.value === 'Shortage' ? 'white' : 
            data.value === 'Delayed' ? 'white' : 
            data.value === 'On Schedule' ? 'white' : 
            "black",
        borderRadius: "5px"
    }),
  };

export default colorStyles