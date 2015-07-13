# Transfer

Handles transfer of a call.

Model : bdsft_webrtc.default.transfer
View : bdsft_webrtc.default.transferview
Dependencies : [Call Control](../callcontrol), [Messages](../messages), [SIP Stack](../sipstack), [Sound](../sound)

## Elements
<a name="elements"></a>

Element  |Type    |Description
---------|--------|----------------------------
accept   |button  |Starts the transfer.
reject   |button  |Cancels the transfer.
target   |input   |Destination for the target

## Properties
<a name="properties"></a>

Property  |Type    |Description
----------|--------|----------------------------------------------
target    |string  |The target destination as a PSTN or SIP URI.

## Configuration
<a name="configuration"></a>

Property        |Type     |Default  |Description
----------------|---------|---------|------------------------------
enableTransfer  |boolean  |true     |True if transfer is enabled.

## Methods
<a name="methods"></a>

Method      |Parameters  |Description
------------|------------|---------------------------------------------------------------------
transfer()  |            |Triggers the transfer using the target and typeAttended properties.
