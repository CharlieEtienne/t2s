function replaceBetween(str, start, end, replace) {
    if (start < 0 || start > str.length) {
        throw new RangeError(`start index ${start} is out of the range 0~${str.length}`);
    }
    if (end > str.length || end < start) {
        throw new RangeError(`end index ${end} is out of the range ${start}~${str.length}`);
    }

    return str.substring(0, start) + replace + str.substring(end);
}

function getNumberBetweenDots(input) {
    let text                 = input.value.toString();
    let start_index          = input.selectionStart;
    let end_index            = input.selectionEnd;
    let previous_dot_index   = text.lastIndexOf(".", start_index - 1);
    let next_dot_index       = text.indexOf(".", end_index);
    let begin                = previous_dot_index < 0 ? 0 : previous_dot_index + 1;
    let end                  = next_dot_index < 0 ? text.length : next_dot_index;
    let previous_space_index = text.substring(begin, end).lastIndexOf(" ", start_index - 1);
    let next_space_index     = text.substring(begin, end).indexOf(" ", end_index);
    begin                    = previous_space_index < 0 ? begin : previous_space_index + 1;
    end                      = next_space_index < 0 ? end : next_space_index;
    let number               = text.substring(begin, end);

    if (isNaN(parseInt(number))){
        return false;
    }

    return {
        'begin':  begin,
        'end':    end,
        'number': parseInt(number),
    };
}