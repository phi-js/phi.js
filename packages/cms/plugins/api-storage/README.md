# API Storage plugin

You configure it by providing async functions to read and create RECORDS.

When a "submit" event ocurs (triggered by a LayoutPage), all data in blocks blocks with v-model and a "_plugin_track.trackable" property is sent to the WRITING configured function

In the editor, a widget to set the "trackable" property and a "title" property is displayed in the "slots.BlockDataEditor" slot