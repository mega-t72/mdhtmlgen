cmake_minimum_required(VERSION 3.5)

project(ts)

file(GLOB MD_LIST CONFIGURE_DEPENDS "${CMAKE_CURRENT_SOURCE_DIR}/*.md")
file(GLOB CSS_LIST CONFIGURE_DEPENDS "${CMAKE_CURRENT_SOURCE_DIR}/web/*.css")
file(GLOB JS_LIST CONFIGURE_DEPENDS "${CMAKE_CURRENT_SOURCE_DIR}/web/*.js")

set(PYTHON "python" CACHE STRING "Python command")

option(TRACE "Print diagnostic traces" OFF)
set(MD_EXT "abbr,def_list,admonition,legacy_attrs,meta,toc,footnotes,md_in_html" CACHE STRING "Default markdown extension list")
set(MDHTMLGEN_EXT "filename,stat,git,custom,meta,glob" CACHE STRING "Default mdhtmlgen extension list")

set(MDHTMLGEN_ARGS -d "%Y-%m-%dT%H:%M:%SZ" -g "${CMAKE_CURRENT_SOURCE_DIR}/../.git" -m "${MD_EXT}" -e "${MDHTMLGEN_EXT}" -H "${CMAKE_CURRENT_SOURCE_DIR}/html.t")

if (TRACE)
    set(MDHTMLGEN_ARGS ${MDHTMLGEN_ARGS} -t)
endif()

set(CMD_LIST)
foreach(filename ${JS_LIST})
    list(APPEND CMD_LIST COMMAND ${CMAKE_COMMAND} -E copy_if_different "${filename}" "${CMAKE_CURRENT_BINARY_DIR}")
    list(APPEND CMD_LIST DEPENDS "${filename}")
endforeach()
list(APPEND CMD_LIST COMMENT "*.js copy")
add_custom_target(js ${CMD_LIST})

set(CMD_LIST)
foreach(filename ${CSS_LIST})
    list(APPEND CMD_LIST COMMAND ${CMAKE_COMMAND} -E copy_if_different "${filename}" "${CMAKE_CURRENT_BINARY_DIR}")
    list(APPEND CMD_LIST DEPENDS "${filename}")
endforeach()
list(APPEND CMD_LIST COMMENT "*.css copy")
add_custom_target(css ${CMD_LIST})

set(CMD_LIST)
foreach(filename ${MD_LIST})
    get_filename_component(name ${filename} NAME_WE)
    list(APPEND CMD_LIST COMMAND "${PYTHON}" -m mdhtmlgen ${MDHTMLGEN_ARGS} -S "${filename}" -o "${CMAKE_CURRENT_BINARY_DIR}/${name}.html")
    list(APPEND CMD_LIST DEPENDS "${filename}")
endforeach()
list(APPEND CMD_LIST COMMENT "generate html")

list(APPEND CMD_LIST DEPENDS "${CMAKE_CURRENT_SOURCE_DIR}/html.t")

add_custom_target(ts ALL ${CMD_LIST} DEPENDS js css)
