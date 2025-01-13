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
            data.value === 'shortage' ? '#FFB3B3' : 
            data.value === "delayed" ? "#F64242" : 
            data.value === "on_schedule" ? "#35A535" : 
            "white",
        textAlign: "center",
        padding: "3px 0 3px 0",
        color: 
            data.value === 'shortage' ? 'white' : 
            data.value === 'delayed' ? 'white' : 
            data.value === 'on_schedule' ? 'white' : 
            "black",
        borderRadius: "5px"
    }),
  };

export default colorStyles