
Represents data that is sensitive in nature of the standard [[User Model]] entity.

![[Pasted image 20240224170547.png]]

#### id
__Type__: String

Unique

#### user
__Type__: [[Back-End/Database/Models/User Model|User Model]]
__Relation__: One-to-One
__Fields__: [[#id]]
__References__: [[User Model#id]]

#### password
__Type__: String

Hashed user password

#### secretkey
__Type__: String

API key. This might be adjusted to it's own type to allow for automatic updating of the key


